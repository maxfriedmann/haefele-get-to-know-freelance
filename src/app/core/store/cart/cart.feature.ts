import { createFeature, createReducer, on } from "@ngrx/store";
import type { FeatureLoadingStatus } from "../common";
import { CartActions } from "./cart.actions";

export interface CartState {
	items: Record<number, number>; // productId -> quantity
	cartId: number | null;
	checkoutStatus: FeatureLoadingStatus;
	error: string | null;
}

export const initialCartState: CartState = {
	items: {},
	cartId: null,
	checkoutStatus: "idle",
	error: null,
};

export const cartFeature = createFeature({
	name: "cart",
	reducer: createReducer(
		initialCartState,

		// --- synchronous mutations (no effect) ---
		on(CartActions.addToCart, (state, { productId }) => ({
			...state,
			items: { ...state.items, [productId]: (state.items[productId] ?? 0) + 1 },
		})),
		on(CartActions.setQuantity, (state, { productId, quantity }) => {
			if (quantity <= 0) {
				const { [productId]: _omit, ...rest } = state.items;
				return { ...state, items: rest };
			}
			return { ...state, items: { ...state.items, [productId]: quantity } };
		}),
		on(CartActions.removeFromCart, (state, { productId }) => {
			const { [productId]: _omit, ...rest } = state.items;
			return { ...state, items: rest };
		}),
		// empties items immediately; the clearCart$ effect DELETEs the server cart
		// (it still needs the cartId, so we keep it until deleteCartSuccess)
		on(CartActions.clearCart, (state) => ({ ...state, items: {} })),

		// --- GET /carts/:id ---
		on(CartActions.loadCart, (state) => ({
			...state,
			checkoutStatus: "loading",
			error: null,
		})),
		on(CartActions.loadCartSuccess, (state, { cart }) => ({
			...state,
			items: Object.fromEntries(
				cart.products.map((p) => [p.productId, p.quantity]),
			),
			cartId: cart.id,
			checkoutStatus: "loaded",
		})),
		on(CartActions.loadCartFailure, (state, { error }) => ({
			...state,
			checkoutStatus: "error",
			error,
		})),

		// --- POST/PUT checkout triad ---
		on(CartActions.checkout, (state) => ({
			...state,
			checkoutStatus: "loading",
			error: null,
		})),
		on(CartActions.checkoutSuccess, (state, { cartId }) => ({
			...state,
			checkoutStatus: "loaded",
			cartId,
		})),
		on(CartActions.checkoutFailure, (state, { error }) => ({
			...state,
			checkoutStatus: "error",
			error,
		})),

		// --- DELETE /carts/:id ---
		on(CartActions.deleteCartSuccess, (state) => ({
			...state,
			items: {},
			cartId: null,
			checkoutStatus: "idle",
			error: null,
		})),
		on(CartActions.deleteCartFailure, (state, { error }) => ({
			...state,
			checkoutStatus: "error",
			error,
		})),
	),
});
