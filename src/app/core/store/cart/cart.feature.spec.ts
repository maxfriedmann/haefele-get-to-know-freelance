import type { Cart } from "../../models/cart.model";
import { CartActions } from "./cart.actions";
import { type CartState, cartFeature, initialCartState } from "./cart.feature";

const { reducer } = cartFeature;

const stateWith = (over: Partial<CartState> = {}): CartState => ({
	...initialCartState,
	...over,
});

describe("cartFeature reducer", () => {
	describe("local mutations", () => {
		it("adds a new item with quantity 1", () => {
			const state = reducer(
				initialCartState,
				CartActions.addToCart({ productId: 5 }),
			);
			expect(state.items).toEqual({ 5: 1 });
		});

		it("increments an existing item", () => {
			const state = reducer(
				stateWith({ items: { 5: 2 } }),
				CartActions.addToCart({ productId: 5 }),
			);
			expect(state.items[5]).toBe(3);
		});

		it("sets an explicit quantity", () => {
			const state = reducer(
				stateWith({ items: { 5: 1 } }),
				CartActions.setQuantity({ productId: 5, quantity: 4 }),
			);
			expect(state.items[5]).toBe(4);
		});

		it("removes the item when quantity drops to zero or below", () => {
			const state = reducer(
				stateWith({ items: { 5: 3 } }),
				CartActions.setQuantity({ productId: 5, quantity: 0 }),
			);
			expect(state.items).toEqual({});
		});

		it("removes an item", () => {
			const state = reducer(
				stateWith({ items: { 5: 3, 6: 1 } }),
				CartActions.removeFromCart({ productId: 5 }),
			);
			expect(state.items).toEqual({ 6: 1 });
		});

		it("empties items on clearCart but keeps the cartId", () => {
			const state = reducer(
				stateWith({ items: { 5: 3 }, cartId: 99 }),
				CartActions.clearCart(),
			);
			expect(state.items).toEqual({});
			expect(state.cartId).toBe(99);
		});
	});

	describe("loadCart", () => {
		it("goes to loading", () => {
			const state = reducer(
				initialCartState,
				CartActions.loadCart({ id: 1 }),
			);
			expect(state.checkoutStatus).toBe("loading");
		});

		it("maps server products into the items map on success", () => {
			const cart: Cart = {
				id: 99,
				userId: 1,
				date: "2026-01-01",
				products: [
					{ productId: 5, quantity: 2 },
					{ productId: 6, quantity: 1 },
				],
			};
			const state = reducer(
				initialCartState,
				CartActions.loadCartSuccess({ cart }),
			);
			expect(state.items).toEqual({ 5: 2, 6: 1 });
			expect(state.cartId).toBe(99);
			expect(state.checkoutStatus).toBe("loaded");
		});

		it("records the error on failure", () => {
			const state = reducer(
				initialCartState,
				CartActions.loadCartFailure({ error: "nope" }),
			);
			expect(state.checkoutStatus).toBe("error");
			expect(state.error).toBe("nope");
		});
	});

	describe("checkout", () => {
		it("goes to loading and clears previous error", () => {
			const state = reducer(
				stateWith({ error: "old" }),
				CartActions.checkout(),
			);
			expect(state.checkoutStatus).toBe("loading");
			expect(state.error).toBeNull();
		});

		it("stores the cartId on success", () => {
			const state = reducer(
				stateWith({ checkoutStatus: "loading" }),
				CartActions.checkoutSuccess({ cartId: 42 }),
			);
			expect(state.checkoutStatus).toBe("loaded");
			expect(state.cartId).toBe(42);
		});

		it("records the error on failure", () => {
			const state = reducer(
				stateWith({ checkoutStatus: "loading" }),
				CartActions.checkoutFailure({ error: "declined" }),
			);
			expect(state.checkoutStatus).toBe("error");
			expect(state.error).toBe("declined");
		});
	});

	describe("deleteCart", () => {
		it("resets the cart on success", () => {
			const state = reducer(
				stateWith({ items: { 5: 1 }, cartId: 99, checkoutStatus: "loaded" }),
				CartActions.deleteCartSuccess(),
			);
			expect(state).toEqual(initialCartState);
		});

		it("records the error on failure", () => {
			const state = reducer(
				initialCartState,
				CartActions.deleteCartFailure({ error: "busy" }),
			);
			expect(state.checkoutStatus).toBe("error");
			expect(state.error).toBe("busy");
		});
	});
});
