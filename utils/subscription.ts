
import { createClient } from "@/utils/supabase/server";

export async function checkSubscriptionStatus(serverId?: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { isPro: false, plan: 'free' };
    }

    let query = supabase
        .from("subscriptions")
        .select("status, price_id, server_id")
        .eq("user_id", user.id)
        .in("status", ["active", "trialing"]);

    // If serverId is provided, check if THIS server has a bound subscription
    if (serverId) {
        query = query.eq("server_id", serverId);
    }

    // If no serverId, we might be looking for any valid sub (e.g. for billing page), 
    // BUT for the new logic, "Pro" status depends on the SERVER having a sub.
    // If checking generic "Do I have any sub?", we remove server_id check.

    const { data: subscription } = await query.maybeSingle();

    if (!subscription) {
        return { isPro: false, plan: 'free' };
    }

    const isPremium = subscription.price_id === process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM;

    return {
        isPro: true,
        plan: isPremium ? 'premium' : 'standard',
        subscription
    };
}
