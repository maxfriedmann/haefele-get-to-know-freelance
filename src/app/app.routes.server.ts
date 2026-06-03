import { RenderMode, type ServerRoute } from "@angular/ssr";

export const serverRoutes: ServerRoute[] = [
	{
		path: "**",
		// Server (not Prerender): we render per request so we can read the
		// Accept-Language header. Prerendering happens at build time, where no
		// request — and therefore no header — exists.
		renderMode: RenderMode.Server,
		// renderMode: RenderMode.Client, // for testing client-side rendering only
	},
];
