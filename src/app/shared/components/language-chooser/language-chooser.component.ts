import { isPlatformBrowser } from "@angular/common";
import { Component, inject, PLATFORM_ID } from "@angular/core";
import { I18nService } from "../../../core/services/i18n.service";

@Component({
	selector: "haefele-language-chooser",
	templateUrl: "./language-chooser.component.html",
})
export class LanguageChooserComponent {
	private readonly i18n = inject(I18nService);

	// Browser-only DOM access guarded for SSR.
	private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	// Re-exposed for the template; all language state lives in I18nService.
	protected readonly languages = this.i18n.languages;
	protected readonly currentLang = this.i18n.currentLang;

	changeLanguage(lang: string) {
		this.i18n.changeLanguage(lang);
		if (this.isBrowser) {
			// daisyUI's dropdown stays open while focus is inside it, so blur to close it.
			(document.activeElement as HTMLElement | null)?.blur();
		}
	}
}
