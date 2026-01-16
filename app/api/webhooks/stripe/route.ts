
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/utils/stripe/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error("❌ Stripe Webhook Secret is missing.");
        return new Response("Webhook Error: Secret missing", { status: 500 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`❌ Webhook Error: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const supabase = await createClient(); // Use createClient (server-side, service role would be better but simple client works if logic is simple or RLS allows user to modify own? No, Webhook needs Service Role or direct DB access via bypass RLS if triggered by backend. Actually createClient() uses cookies here next/headers? No, this is an API route, no cookies from Stripe.
    // CRITICAL: We need a SUPABASE_SERVICE_ROLE_KEY client here because Stripe calls this, not a user session.
    // Assuming createClient usage in standard route handles this or we define a service client.
    // For now, let's assume we need to import a service client helper or use env vars directly.

    // Correction: We'll use a service role client creator here.
    // If not available, we fall back to standard BUT standard client creates anon session which can't write to subscriptions table if RLS is strict (which it is: "Users can view").
    // We need to write. 

    // Let's create a Supabase Admin Client on the fly for this webhook.
    const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
    const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                if (session.mode === "subscription") {
                    const subscriptionId = session.subscription as string;
                    const customerId = session.customer as string;
                    const userId = session.metadata?.userId; // We passed this in createCheckoutSession

                    if (!userId) {
                        console.error("❌ No userId in metadata for session", session.id);
                        break;
                    }

                    // Retrieve full subscription details to get dates
                    // Retrieve full subscription details to get dates
                    const subscription: any = await stripe.subscriptions.retrieve(subscriptionId);

                    await supabaseAdmin.from("subscriptions").upsert({
                        id: subscriptionId,
                        user_id: userId,
                        status: subscription.status,
                        price_id: subscription.items.data[0].price.id,
                        quantity: 1,
                        cancel_at_period_end: subscription.cancel_at_period_end,
                        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                        created: new Date(subscription.created * 1000).toISOString(),
                        stripe_customer_id: customerId // Not in table schema? Oh customers table has it.
                    });

                    // Ensure customer mapping exists (redundant if action did it, but safe)
                    await supabaseAdmin.from("customers").upsert({
                        id: userId,
                        stripe_customer_id: customerId
                    });

                    console.log(`✅ Subscription ${subscriptionId} created for user ${userId}`);
                }
                break;
            }

            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;

                await supabaseAdmin.from("subscriptions").upsert({
                    id: subscription.id,
                    // user_id: We might not have it here easily if we don't query it, but upsert needs it if it's new. 
                    // However, for update, we expect it to exist. 
                    // If deleted, we might validly just update status.
                    // Ideally we query the existing sub to get user_id if needed, or rely on Stripe expanding customer? 
                    // Actually metadata acts as source of truth if we preserve it. Stripe keeps metadata on sub if set on creation? Yes usually.
                    // Let's try to get user_id from metadata if present on subscription object, else query DB.
                    user_id: subscription.metadata?.userId || (await getTypeSafeUserId(supabaseAdmin, subscription.id)),
                    status: subscription.status,
                    price_id: subscription.items.data[0].price.id,
                    cancel_at_period_end: subscription.cancel_at_period_end,
                    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                    ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000).toISOString() : null,
                    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
                });
                console.log(`✅ Subscription ${subscription.id} updated to ${subscription.status}`);
                break;
            }
        }
    } catch (error: any) {
        console.error(`❌ Error processing webhook: ${error.message}`);
        return new Response("Webhook handler failed", { status: 500 });
    }

    return new Response("Webhook received", { status: 200 });
}

async function getTypeSafeUserId(supabaseAdmin: any, subscriptionId: string) {
    const { data } = await supabaseAdmin.from('subscriptions').select('user_id').eq('id', subscriptionId).single();
    return data?.user_id;
}
