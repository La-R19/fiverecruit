
import { createClient } from "@/utils/supabase/server";

export async function checkSubscriptionStatus() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { isPro: false, plan: 'free' };
    }

    const { data: subscription } = await supabase
        .from("subscriptions")
        .select("status, price_id")
        .eq("user_id", user.id)
        .in("status", ["active", "trialing"])
        .maybeSingle();

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
