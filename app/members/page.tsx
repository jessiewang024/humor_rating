import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function MembersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user.id)
    .single();

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Members only 🔒</h1>
      <p>Welcome back, {profile?.first_name ?? user.email}! Only logged-in users can see this page.</p>
    </main>
  );
}
