import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user!.id)
        .single();

      const needsOnboarding = !profile?.first_name || !profile?.last_name;
      return NextResponse.redirect(`${origin}${needsOnboarding ? "/onboarding" : "/"}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
