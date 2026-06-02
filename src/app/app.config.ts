import {
	type ApplicationConfig,
	isDevMode,
	provideBrowserGlobalErrorListeners,
} from "@angular/core";
import {
	provideClientHydration,
	withEventReplay,
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
		provideClientHydration(withEventReplay()),
		provideTranslateService({
			lang: "en",
			fallbackLang: "en",
			loader: provideTranslateLoader(BundledTranslateLoader),
		}),
		provideServiceWorker("ngsw-worker.js", {
			enabled: !isDevMode(),
			registrationStrategy: "registerWhenStable:30000",
		}),
	],
};
