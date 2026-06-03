import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import type { Product } from "../../../core/models/product.model";
import { AppCurrencyPipe } from "../../pipes/app-currency.pipe";
import { AddToCartButtonComponent } from "../add-to-cart-button/add-to-cart-button.component";
import { RatingComponent } from "../rating/rating.component";

@Component({
	selector: "haefele-product-card",
	templateUrl: "./product-card.component.html",
	imports: [
		AppCurrencyPipe,
		RatingComponent,
		RouterLink,
		AddToCartButtonComponent,
	],
})
export class ProductCardComponent {
	product = input.required<Product>();
}
