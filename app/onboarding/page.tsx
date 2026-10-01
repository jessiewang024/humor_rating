import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  async function saveName(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    await supabase
      .from("profiles")
      .update({
        first_name: String(formData.get("first_name")).trim(),
        last_name: String(formData.get("last_name")).trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    redirect("/");
  }

  return (
    <main className="max-w-md mx-auto p-8 mt-12">
      <h1 className="text-3xl font-bold mb-2">Welcome! 👋</h1>
      <p className="text-gray-500 mb-6">Tell us your name to finish setting up.</p>
      <form action={saveName} className="space-y-4">
        <input name="first_name" placeholder="First name" required
          className="w-full border rounded-lg px-4 py-2" />
        <input name="last_name" placeholder="Last name" required
          className="w-full border rounded-lg px-4 py-2" />
        <button className="bg-black text-white px-6 py-2 rounded-full">Continue</button>
      </form>
    </main>
  );
}
