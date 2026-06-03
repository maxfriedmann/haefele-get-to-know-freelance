// Vercel serverless entry for Angular SSR.
// Re-exports the Node request handler produced by `ng build` (outputMode: "server").
// The build emits dist/shop/server/server.mjs which exports `reqHandler`.
export { reqHandler as default } from "../dist/shop/server/server.mjs";
