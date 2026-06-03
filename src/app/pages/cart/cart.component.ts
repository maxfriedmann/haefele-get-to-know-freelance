import { AsyncPipe } from "@angular/common";
import { Component, inject, isDevMode } from "@angular/core";
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

	// dev-only helper button; isDevMode() is false in production builds
	protected readonly isDev = isDevMode();

	entries$ = this.cartFacade.entries$;
	total$ = this.cartFacade.total$;
	checkoutStatus$ = this.cartFacade.checkoutStatus$;
	cartId$ = this.cartFacade.cartId$;

	constructor() {
		// entries$ joins cart items with product data, so make sure products are loaded.
		// the cache guard makes this a no-op if they already are.
		this.productsFacade.load();
	}

	loadSampleCart() {
		// demonstrates the GET /carts/:id effect by loading an existing server cart
		this.cartFacade.loadCart(1);
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
