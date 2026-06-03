import { DOCUMENT, isPlatformServer } from "@angular/common";
import type { HttpInterceptorFn } from "@angular/common/http";
import { inject, PLATFORM_ID, REQUEST } from "@angular/core";

/**
 * Resolves relative API URLs (e.g. the static `/products.json` served from this
 * app's own origin) to absolute ones.
 *
 * - On the server this is required: Angular's SSR HttpClient cannot fetch
 *   relative URLs, so we prepend the incoming request's origin.
 * - On the client we apply the same rewrite (using the page origin) so the
 *   request URL is identical on both sides. That keeps the HttpTransferCache
 *   key in sync between server and client — otherwise the browser would miss
 *   the SSR-cached response and re-fetch on hydration.
 *
 * The runtime origin means it works in dev (localhost) and prod (the deployed
 * domain) with no hardcoded host and no cross-origin/CORS. Absolute URLs (e.g.
 * the cart API) are left untouched.
 */
export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
	if (!req.url.startsWith("/")) {
		return next(req);
	}

	let origin: string | undefined;
	if (isPlatformServer(inject(PLATFORM_ID))) {
		const requestUrl = inject(REQUEST, { optional: true })?.url;
		origin = requestUrl ? new URL(requestUrl).origin : undefined;
	} else {
		origin = inject(DOCUMENT).location.origin;
	}

	return next(origin ? req.clone({ url: origin + req.url }) : req);
};
