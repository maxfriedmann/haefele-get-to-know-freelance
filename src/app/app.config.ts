import {
	type ApplicationConfig,
	DEFAULT_CURRENCY_CODE,
	isDevMode,
	LOCALE_ID,
	provideBrowserGlobalErrorListeners,
} from "@angular/core";
import {
	provideClientHydration,
	withEventReplay,
	withHttpTransferCacheOptions,
} from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { provideServiceWorker } from "@angular/service-worker";
import {
	provideTranslateLoader,
	provideTranslateService,
} from "@ngx-translate/core";
import { routes } from "./app.routes";
import { BundledTranslateLoader } from "./i18n/translate.loader";

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(routes),
		provideClientHydration(withEventReplay(), withHttpTransferCacheOptions({})),
		provideTranslateService({
			lang: "de",
			fallbackLang: "en",
			loader: provideTranslateLoader(BundledTranslateLoader),
		}),
		{ provide: DEFAULT_CURRENCY_CODE, useValue: "EUR" },
		{ provide: LOCALE_ID, useValue: "de-DE" },
		provideServiceWorker("ngsw-worker.js", {
			enabled: !isDevMode(),
			registrationStrategy: "registerWhenStable:30000",
		}),
	],
};
