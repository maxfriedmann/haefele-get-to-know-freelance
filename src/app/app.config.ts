import { provideHttpClient, withFetch } from "@angular/common/http";
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
import { provideEffects } from "@ngrx/effects";
import { provideState, provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import {
	provideTranslateLoader,
	provideTranslateService,
} from "@ngx-translate/core";
import { routes } from "./app.routes";
import { CartEffects } from "./core/store/cart/cart.effects";
import { cartFeature } from "./core/store/cart/cart.feature";
import { ProductsEffects } from "./core/store/products/products.effects";
import { productsFeature } from "./core/store/products/products.feature";
import { BundledTranslateLoader } from "./i18n/translate.loader";

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideHttpClient(withFetch()),
		provideRouter(routes),
		provideStore(),
		provideStoreDevtools({
			maxAge: 25,
			logOnly: !isDevMode(),
			connectInZone: true,
			trace: true,
			traceLimit: 75,
		}),
		provideState(productsFeature),
		provideState(cartFeature),
		provideEffects(ProductsEffects, CartEffects),
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
