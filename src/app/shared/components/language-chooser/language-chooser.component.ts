import { isPlatformBrowser } from "@angular/common";
import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";

// ngx-translate has no built-in persistence, so we store the choice ourselves.
// will only work in the browser, but that's fine since SSR doesn't persist anything anyway yet.
// If a backend would be available, we could store it in a cookie or the user profile.
const LANGUAGE_STORAGE_KEY = "language";

@Component({
	selector: "haefele-language-chooser",
	templateUrl: "./language-chooser.component.html",
	imports: [FormsModule],
})
export class LanguageChooserComponent {
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

	// The current language is stored in a signal to trigger change detection when it changes.
	readonly currentLang = signal(this.resolveInitialLang());

	constructor() {
		this.translationService.use(this.currentLang());
	}

	// This method is called when the user selects a different language from the dropdown.
	changeLanguage(lang: string) {
		this.currentLang.set(lang);
		this.translationService.use(lang);
		if (this.isBrowser) {
			localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
			// daisyUI's dropdown stays open while focus is inside it, so blur to close it.
			(document.activeElement as HTMLElement | null)?.blur();
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
