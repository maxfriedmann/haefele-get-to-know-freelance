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
		on(CartActions.clearCart, (state) => ({
			...state,
			items: {},
			cartId: null,
			checkoutStatus: "idle",
			error: null,
		})),

		// --- async checkout triad ---
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
	),
});
