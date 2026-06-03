import { isPlatformServer } from "@angular/common";
import type { HttpInterceptorFn } from "@angular/common/http";
import { inject, PLATFORM_ID, REQUEST } from "@angular/core";

/**
 * fakestoreapi.com sits behind Cloudflare, which serves a "Just a moment..."
 * bot challenge (HTTP 403) to requests coming from datacenter IPs with a
 * non-browser User-Agent — i.e. every SSR request from Vercel/k8s/etc.
 *
 * In the browser the request carries the user's real User-Agent and is never
 * challenged, so we only act on the server. There we forward the incoming
 * visitor's User-Agent (read from the SSR request) and fall back to a generic
 * browser User-Agent when none is present.
 * Node's fetch (undici) allows overriding User-Agent; browsers forbid it,
 * which is why this is guarded to the server platform.
 */
const FALLBACK_USER_AGENT =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export const userAgentInterceptor: HttpInterceptorFn = (req, next) => {
	if (isPlatformServer(inject(PLATFORM_ID))) {
		const incomingUserAgent = inject(REQUEST, { optional: true })?.headers.get(
			"user-agent",
		);
		req = req.clone({
			setHeaders: { "User-Agent": incomingUserAgent || FALLBACK_USER_AGENT },
		});
	}
	return next(req);
};
