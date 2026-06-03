import { Injectable, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { CartActions } from "./cart.actions";
import { cartFeature } from "./cart.feature";
import {
	selectCartCount,
	selectCartEntries,
	selectCartTotal,
} from "./cart.selectors";

/**
 * Public API for the cart feature. Components depend on this facade instead
 * of the Store/actions/selectors directly, keeping NgRx an implementation detail.
 */
@Injectable({ providedIn: "root" })
export class CartFacade {
	private readonly store = inject(Store);

	// reads
	readonly entries$ = this.store.select(selectCartEntries);
	readonly total$ = this.store.select(selectCartTotal);
	readonly count$ = this.store.select(selectCartCount);
	readonly checkoutStatus$ = this.store.select(
		cartFeature.selectCheckoutStatus,
	);
	readonly cartId$ = this.store.select(cartFeature.selectCartId);

	// writes
	loadCart(id: number): void {
		this.store.dispatch(CartActions.loadCart({ id }));
	}

	add(productId: number): void {
		this.store.dispatch(CartActions.addToCart({ productId }));
	}

	setQuantity(productId: number, quantity: number): void {
		this.store.dispatch(CartActions.setQuantity({ productId, quantity }));
	}

	remove(productId: number): void {
		this.store.dispatch(CartActions.removeFromCart({ productId }));
	}

	clear(): void {
		this.store.dispatch(CartActions.clearCart());
	}

	checkout(): void {
		this.store.dispatch(CartActions.checkout());
	}
}
