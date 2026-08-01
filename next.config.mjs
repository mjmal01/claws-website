/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pins the workspace root explicitly so Turbopack never misidentifies it
  // from a stray lockfile elsewhere on disk (seen once during this repo's
  // Next 16 upgrade — a transient package-lock.json outside the project).
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
