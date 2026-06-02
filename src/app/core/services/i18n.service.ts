import { isPlatformBrowser, registerLocaleData } from "@angular/common";
import localeDe from "@angular/common/locales/de";
import localeEn from "@angular/common/locales/en";
import { inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

registerLocaleData(localeEn);
registerLocaleData(localeDe);

// ngx-translate has no built-in persistence, so we store the choice ourselves.
// Only works in the browser; SSR doesn't persist anything yet.
// If a backend were available, we could store it in a cookie or the user profile.
const LANGUAGE_STORAGE_KEY = "language";

@Injectable({ providedIn: "root" })
export class I18nService {
	private readonly translationService = inject(TranslateService);

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

	// Restores the persisted language on load, falling back to the configured default.
	private resolveInitialLang(): string {
		const stored = this.isBrowser
			? localStorage.getItem(LANGUAGE_STORAGE_KEY)
			: null;
		const fallback = this.translationService.getFallbackLang() ?? "en";
		return this.isSupported(stored) ? stored : fallback;
	}

	private isSupported(lang: string | null): lang is string {
		return lang !== null && this.languages.some((l) => l.code === lang);
	}
}
