"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  async function signInWithGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <main className="max-w-md mx-auto p-8 mt-20 text-center">
      <h1 className="text-3xl font-bold mb-6">Log in</h1>
      <button
        onClick={signInWithGoogle}
        className="bg-black text-white px-6 py-3 rounded-full"
      >
        Continue with Google
      </button>
    </main>
  );
}
