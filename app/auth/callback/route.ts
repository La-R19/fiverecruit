
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // The `request` object gives us access to the URL and query parameters.
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next") ?? "/dashboard";

    if (code) {
        const supabase = await createClient(); // Await the promise to get the client instance

        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // If successful, redirect to the dashboard or the 'next' URL
            const origin = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // If there's an error or no code, redirect to the login page with an error parameter
    const origin = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;
    return NextResponse.redirect(`${origin}/login?error=auth`);
}
