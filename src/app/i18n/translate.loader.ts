import { Injectable } from "@angular/core";
import type { TranslateLoader, TranslationObject } from "@ngx-translate/core";
import { type Observable, of } from "rxjs";
import de from "./de.json";
import en from "./en.json";

const TRANSLATIONS: Record<string, TranslationObject> = { en, de };

/**
 * Loads translations bundled at build time instead of fetching them over HTTP.
 * This avoids a runtime round-trip and the SSR translation-key flicker.
 * If the translation files grow, then we should load them on demand based on the current language.
 */
@Injectable()
export class BundledTranslateLoader implements TranslateLoader {
	getTranslation(lang: string): Observable<TranslationObject> {
		return of(TRANSLATIONS[lang] ?? {});
	}
}
