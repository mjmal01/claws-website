// Polyfills `process` before the rest of the bundle evaluates. next/image's
// client component reads process.env.__NEXT_IMAGE_OPTS at module top level
// (normally injected by Next's own webpack build) — with no `process`
// global in a plain browser bundle, that throws immediately and takes the
// whole shared IIFE down with it (every component fails, not just the ones
// using next/image, since they all share one _ds_bundle.js). Wired in via
// cfg.extraEntries, which places this module's top-level code ahead of the
// main entry's in the bundle — the sanctioned way to do this without
// forking bundle.mjs (off-limits per the design-sync skill).
if (typeof (globalThis as unknown as { process?: unknown }).process === 'undefined') {
  ;(globalThis as unknown as { process: { env: Record<string, string> } }).process = { env: {} }
}
