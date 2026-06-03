import { isPlatformBrowser, registerLocaleData } from "@angular/common";
import localeDe from "@angular/common/locales/de";
import localeEn from "@angular/common/locales/en";
import {
	Injectable,
	inject,
	makeStateKey,
	PLATFORM_ID,
	REQUEST,
	signal,
	TransferState,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

registerLocaleData(localeEn);
registerLocaleData(localeDe);

// ngx-translate has no built-in persistence, so we store the choice ourselves.
// Only works in the browser; SSR doesn't persist anything yet.
// If a backend were available, we could store it in a cookie or the user profile.
const LANGUAGE_STORAGE_KEY = "language";

// Carries the server-resolved language to the client so the first client render
// matches the SSR output (no hydration flicker). See resolveInitialLang().
const LANGUAGE_STATE_KEY = makeStateKey<string>("language");

@Injectable({ providedIn: "root" })
export class I18nService {
	private readonly translationService = inject(TranslateService);
	private readonly transferState = inject(TransferState);

	// The incoming HTTP request, available during SSR only (null in the browser).
	private readonly request = inject(REQUEST, { optional: true });

	// localStorage only exists in the browser, not during SSR.
	private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	// The selectable languages, used to render the switcher options.
	readonly languages = [
		{
			code: "en",
			icon: "https://cdn.smallstack.com/images/flags/flag-icon-css/flags/4x3/us.svg",
		},
		{
			code: "de",
			icon: "https://cdn.smallstack.com/images/flags/flag-icon-css/flags/4x3/de.svg",
		},
	] as const;

	// The current language is held in a signal to trigger change detection when it changes.
	readonly currentLang = signal(this.resolveInitialLang());

	constructor() {
		this.translationService.use(this.currentLang());
	}

	// Switches the active language and persists the choice (browser only).
	// `currentLang` is also the locale source for formatting (see AppCurrencyPipe):
	// LOCALE_ID is fixed at bootstrap, so number/currency formatting reads this signal instead.
	changeLanguage(lang: string) {
		this.currentLang.set(lang);
		this.translationService.use(lang);
		if (this.isBrowser) {
			localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
		}
	}

	// Decides which language to render with on first load.
	//
	// Server: there is no persisted choice yet, so we honour the browser's
	// Accept-Language header and hand the result to the client via TransferState.
	// Client: an explicit user choice (localStorage) wins; otherwise we reuse the
	// value the server rendered with, so hydration matches and nothing flickers.
	private resolveInitialLang(): string {
		const fallback = this.translationService.getFallbackLang() ?? "en";

		if (!this.isBrowser) {
			const fromHeader = this.langFromAcceptLanguage();
			const lang = fromHeader ?? fallback;
			this.transferState.set(LANGUAGE_STATE_KEY, lang);
			return lang;
		}

		const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
		if (this.isSupported(stored)) {
			return stored;
		}

		const transferred = this.transferState.get(LANGUAGE_STATE_KEY, fallback);
		return this.isSupported(transferred) ? transferred : fallback;
	}

	// Picks the first supported language from the Accept-Language header,
	// e.g. "de-DE,de;q=0.9,en;q=0.8" -> "de". Quality values are already in
	// priority order from the browser, so we just scan left to right.
	private langFromAcceptLanguage(): string | null {
		const header = this.request?.headers.get("accept-language");
		if (!header) {
			return null;
		}
		for (const part of header.split(",")) {
			const code = part.split(";")[0]?.trim().split("-")[0]?.toLowerCase();
			if (this.isSupported(code ?? null)) {
				return code;
			}
		}
		return null;
	}

	private isSupported(lang: string | null): lang is string {
		return lang !== null && this.languages.some((l) => l.code === lang);
	}
}
