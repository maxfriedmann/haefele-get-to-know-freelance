import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";
import { TranslatePipe } from "@ngx-translate/core";
import { CartActions } from "../../core/store/cart/cart.actions";
import { cartFeature } from "../../core/store/cart/cart.feature";
import {
	selectCartEntries,
	selectCartTotal,
} from "../../core/store/cart/cart.selectors";
import { ProductsActions } from "../../core/store/products/products.actions";
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
	private readonly store = inject(Store);

	entries$ = this.store.select(selectCartEntries);
	total$ = this.store.select(selectCartTotal);
	checkoutStatus$ = this.store.select(cartFeature.selectCheckoutStatus);
	cartId$ = this.store.select(cartFeature.selectCartId);

	constructor() {
		// entries$ joins cart items with product data, so make sure products are loaded.
		// the cache guard makes this a no-op if they already are.
		this.store.dispatch(ProductsActions.loadProducts());
	}

	setQuantity(productId: number, quantity: number) {
		this.store.dispatch(CartActions.setQuantity({ productId, quantity }));
	}

	remove(productId: number) {
		this.store.dispatch(CartActions.removeFromCart({ productId }));
	}

	clear() {
		this.store.dispatch(CartActions.clearCart());
	}

	checkout() {
		this.store.dispatch(CartActions.checkout());
	}
}
