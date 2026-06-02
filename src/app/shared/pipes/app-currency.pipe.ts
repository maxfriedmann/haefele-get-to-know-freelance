import { formatCurrency, getCurrencySymbol } from "@angular/common";
import { inject, Pipe, type PipeTransform } from "@angular/core";
import { I18nService } from "../../core/services/i18n.service";

// Formats a value as EUR using the locale of the currently selected language,
// so the number/symbol format follows the language switch (en: €1,234.56 / de: 1.234,56 €).
// Impure on purpose: LOCALE_ID is fixed at bootstrap, so we read the language signal at
// transform time and re-evaluate when it changes instead of relying on a static locale.
@Pipe({ name: "appCurrency", pure: false })
export class AppCurrencyPipe implements PipeTransform {
	private readonly i18n = inject(I18nService);

	transform(value: number | null | undefined): string | null {
		if (value == null) {
			return null;
		}
		const locale = this.i18n.currentLang();
		return formatCurrency(
			value,
			locale,
			getCurrencySymbol("EUR", "narrow", locale),
			"EUR",
			"1.2-2",
		);
	}
}
