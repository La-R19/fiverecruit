'use server'

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { stripe } from "./server";
import { createClient } from "@/utils/supabase/server";

export async function createCheckoutSession(priceId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("You must be logged in to subscribe.");
    }

    // Check if they already have a customer ID in our DB
    const { data: customerData } = await supabase
        .from("customers")
        .select("stripe_customer_id")
        .eq("id", user.id)
        .single();

    let customerId = customerData?.stripe_customer_id;

    // Create customer in Stripe if not exists
    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            metadata: {
                supabase_uuid: user.id,
            },
        });
        customerId = customer.id;

        // Save to our DB
        await supabase.from("customers").insert({
            id: user.id,
            stripe_customer_id: customerId,
        });
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://fiverecruit.com';

    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: "subscription",
        success_url: `${origin}/dashboard?success=true`,
        cancel_url: `${origin}/pricing?canceled=true`,
        metadata: {
            userId: user.id
        },
        allow_promotion_codes: true,
    });

    if (!session.url) {
        throw new Error("Failed to create checkout session");
    }

    redirect(session.url);
}

export async function createPortalSession() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("You must be logged in.");
    }

    const { data: customerData } = await supabase
        .from("customers")
        .select("stripe_customer_id")
        .eq("id", user.id)
        .single();

    if (!customerData?.stripe_customer_id) {
        throw new Error("No billing account found.");
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://fiverecruit.com';

    const session = await stripe.billingPortal.sessions.create({
        customer: customerData.stripe_customer_id,
        return_url: `${origin}/dashboard`,
    });

    redirect(session.url);
}
