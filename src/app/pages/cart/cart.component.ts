import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { CartFacade } from "../../core/store/cart/cart.facade";
import { ProductsFacade } from "../../core/store/products/products.facade";
import { PageHeaderComponent } from "../../shared/components/page-header/page-header.component";
import { AppCurrencyPipe } from "../../shared/pipes/app-currency.pipe";

@Component({
	imports: [
		AsyncPipe,
		RouterLink,
		TranslatePipe,
		AppCurrencyPipe,
		PageHeaderComponent,
	],
	templateUrl: "./cart.component.html",
})
export class CartComponent {
	private readonly cartFacade = inject(CartFacade);
	private readonly productsFacade = inject(ProductsFacade);

	entries$ = this.cartFacade.entries$;
	total$ = this.cartFacade.total$;
	checkoutStatus$ = this.cartFacade.checkoutStatus$;
	cartId$ = this.cartFacade.cartId$;

	constructor() {
		// entries$ joins cart items with product data, so make sure products are loaded.
		// the cache guard makes this a no-op if they already are.
		this.productsFacade.load();
	}

	setQuantity(productId: number, quantity: number) {
		this.cartFacade.setQuantity(productId, quantity);
	}

	remove(productId: number) {
		this.cartFacade.remove(productId);
	}

	clear() {
		this.cartFacade.clear();
	}

	checkout() {
		this.cartFacade.checkout();
	}
}
