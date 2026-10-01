"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

type Props = {
  userId: string;
  email: string;
  initialFirstName: string;
  initialLastName: string;
  initialAvatarUrl: string | null;
  initialMbti: string;
};

export default function ProfileForm({
  userId, email, initialFirstName, initialLastName, initialAvatarUrl, initialMbti,
}: Props) {
  const supabase = createClient();
  const router = useRouter();
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [mbti, setMbti] = useState(initialMbti);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  async function handleSave() {
    setStatus("Saving...");
    let newAvatarUrl = avatarUrl;

    if (file) {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file);
      if (uploadError) {
        setStatus(`Upload failed: ${uploadError.message}`);
        return;
      }
      newAvatarUrl = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName.trim() || null,
        last_name: lastName.trim() || null,
        mbti: mbti || null,
        avatar_url: newAvatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      setStatus(`Save failed: ${error.message}`);
      return;
    }
    setAvatarUrl(newAvatarUrl);
    setFile(null);
    setStatus("Saved ✓");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-200" />
      )}
      <p className="text-sm text-gray-500">{email}</p>

      <label className="block">
        <span className="text-sm font-medium">First name</span>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)}
          className="mt-1 w-full border rounded-lg px-4 py-2" />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Last name</span>
        <input value={lastName} onChange={(e) => setLastName(e.target.value)}
          className="mt-1 w-full border rounded-lg px-4 py-2" />
      </label>

      <label className="block">
        <span className="text-sm font-medium">MBTI? <span className="text-gray-400">(optional)</span></span>
        <select value={mbti} onChange={(e) => setMbti(e.target.value)}
          className="mt-1 w-full border rounded-lg px-4 py-2">
          <option value="">Prefer not to say</option>
          {MBTI_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium">Profile photo</span>
        <input type="file" accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1 block" />
      </label>

      <button onClick={handleSave} className="bg-black text-white px-6 py-2 rounded-full">
        Save
      </button>
      {status && <p className="text-sm">{status}</p>}
    </div>
  );
}
