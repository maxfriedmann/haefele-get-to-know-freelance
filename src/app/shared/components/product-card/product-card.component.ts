import { Component, input, output } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import type { Product } from "../../../core/models/product.model";
import { AppCurrencyPipe } from "../../pipes/app-currency.pipe";
import { RatingComponent } from "../rating/rating.component";

@Component({
	selector: "haefele-product-card",
	templateUrl: "./product-card.component.html",
	imports: [AppCurrencyPipe, TranslatePipe, RatingComponent],
})
export class ProductCardComponent {
	product = input.required<Product>();

	detailsClick = output<void>();
	addToCartClick = output<void>();

	onAddToCartClick(event: MouseEvent) {
		event.stopPropagation();
		this.addToCartClick.emit();
	}
}
