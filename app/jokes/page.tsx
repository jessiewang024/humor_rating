import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export default async function JokesPage() {
    const { data: jokes, error } = await supabase
        .from("jokes")
        .select("*")
        .order("id");

    if (error) return <main className="p-8">Error: {error.message}</main>;

    return (
        <main className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Jokes</h1>
            <ul className="space-y-4">
                {jokes?.map((joke) => (
                    <li key={joke.id} className="border rounded-xl p-5">
                        <p className="font-semibold">{joke.setup}</p>
                        <p className="text-gray-500 mt-2">{joke.punchline}</p>
                    </li>
                ))}
            </ul>
        </main>
    );
}