import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, avatar_url, mbti")
    .eq("id", user.id)
    .single();

  return (
    <main className="max-w-md mx-auto p-8 mt-12">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <ProfileForm
        userId={user.id}
        email={user.email ?? ""}
        initialFirstName={profile?.first_name ?? ""}
        initialLastName={profile?.last_name ?? ""}
        initialAvatarUrl={profile?.avatar_url ?? null}
        initialMbti={profile?.mbti ?? ""}
      />
    </main>
  );
}
