import { createServerClient } from "@supabase/ssr";
const jar = [];
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { cookies: { getAll: () => [], setAll: (c) => jar.push(...c) } },
);
const { error } = await supabase.auth.signInWithPassword({
  email: process.argv[2], password: "password123",
});
if (error) { console.error("FAILED:", error.message); process.exit(1); }
console.log(JSON.stringify(jar.map((c) => ({ name: c.name, value: c.value }))));
