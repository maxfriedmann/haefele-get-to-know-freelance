// Product reads are served as a static asset from this app's own origin
// (public/products.json), fetched via a relative URL. fakestoreapi.com sits
// behind Cloudflare, which 403s datacenter IPs (our SSR server), so the data
// is self-hosted instead.

// The cart checkout (POST /carts) only runs in the user's browser, which
// Cloudflare does not block, so it stays on upstream fakestoreapi.
export const CART_API_BASE = "https://fakestoreapi.com";
