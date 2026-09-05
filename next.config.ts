import type { NextConfig } from "next";

/**
 * Avatars are served from the project's Supabase storage CDN. Deriving the host
 * from the env var keeps the allowlist correct across projects without a
 * hardcoded domain.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseUrl
      ? [new URL(`${supabaseUrl}/storage/v1/object/public/**`)]
      : [],
  },
};

export default nextConfig;
