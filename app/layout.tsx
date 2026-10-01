import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Humor Rating",
  description: "Jokes from Supabase",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="flex items-center gap-4 px-8 py-4 border-b">
          <Link href="/" className="font-bold">Humor Rating</Link>
          {user ? (
            <>
              <Link href="/members">Members</Link>
              <Link href="/profile">Profile</Link>
              <span className="ml-auto text-sm text-gray-500">{user.email}</span>
              <form action="/auth/signout" method="post">
                <button className="text-sm underline">Log out</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="ml-auto">Log in</Link>
          )}
        </nav>
        {children}
      </body>
    </html>
  );
}
