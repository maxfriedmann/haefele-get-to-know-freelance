import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import type { Action } from "@ngrx/store";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { type Observable, of, throwError } from "rxjs";
import type { Cart } from "../../models/cart.model";
import { CartService } from "../../services/cart.service";
import { CartActions } from "./cart.actions";
import { CartEffects } from "./cart.effects";
import { cartFeature } from "./cart.feature";

const cart = (over: Partial<Cart> = {}): Cart => ({
	id: 42,
	userId: 1,
	date: "2026-01-01",
	products: [],
	...over,
});

describe("CartEffects", () => {
	let actions$: Observable<Action>;
	let cartService: {
		getCart: ReturnType<typeof vi.fn>;
		createCart: ReturnType<typeof vi.fn>;
		updateCart: ReturnType<typeof vi.fn>;
		deleteCart: ReturnType<typeof vi.fn>;
	};
	let store: MockStore;

	beforeEach(() => {
		cartService = {
			getCart: vi.fn(),
			createCart: vi.fn(),
			updateCart: vi.fn(),
			deleteCart: vi.fn(),
		};
		TestBed.configureTestingModule({
			providers: [
				CartEffects,
				provideMockActions(() => actions$),
				provideMockStore(),
				{ provide: CartService, useValue: cartService },
			],
		});
		store = TestBed.inject(MockStore);
		store.overrideSelector(cartFeature.selectItems, {});
		store.overrideSelector(cartFeature.selectCartId, null);
	});

	const run = (effect: keyof CartEffects): Action | undefined => {
		let result: Action | undefined;
		(TestBed.inject(CartEffects)[effect] as Observable<Action>).subscribe(
			(a) => {
				result = a;
			},
		);
		return result;
	};

	describe("loadCart$", () => {
		it("emits success with the fetched cart", () => {
			const loaded = cart({ id: 7 });
			cartService.getCart.mockReturnValue(of(loaded));
			actions$ = of(CartActions.loadCart({ id: 7 }));

			expect(run("loadCart$")).toEqual(
				CartActions.loadCartSuccess({ cart: loaded }),
			);
			expect(cartService.getCart).toHaveBeenCalledWith(7);
		});

		it("emits failure when the service throws", () => {
			cartService.getCart.mockReturnValue(throwError(() => new Error("404")));
			actions$ = of(CartActions.loadCart({ id: 7 }));

			expect(run("loadCart$")).toEqual(
				CartActions.loadCartFailure({ error: "404" }),
			);
		});
	});

	describe("checkout$", () => {
		it("creates a cart when none exists yet", () => {
			store.overrideSelector(cartFeature.selectItems, { 5: 2 });
			store.overrideSelector(cartFeature.selectCartId, null);
			cartService.createCart.mockReturnValue(of(cart({ id: 100 })));
			actions$ = of(CartActions.checkout());

			expect(run("checkout$")).toEqual(
				CartActions.checkoutSuccess({ cartId: 100 }),
			);
			expect(cartService.createCart).toHaveBeenCalled();
			expect(cartService.updateCart).not.toHaveBeenCalled();
		});

		it("updates the existing cart when a cartId is present", () => {
			store.overrideSelector(cartFeature.selectItems, { 5: 1 });
			store.overrideSelector(cartFeature.selectCartId, 100);
			cartService.updateCart.mockReturnValue(of(cart({ id: 100 })));
			actions$ = of(CartActions.checkout());

			expect(run("checkout$")).toEqual(
				CartActions.checkoutSuccess({ cartId: 100 }),
			);
			expect(cartService.updateCart).toHaveBeenCalledWith(
				100,
				expect.objectContaining({ products: [{ productId: 5, quantity: 1 }] }),
			);
			expect(cartService.createCart).not.toHaveBeenCalled();
		});

		it("emits failure when the request fails", () => {
			cartService.createCart.mockReturnValue(
				throwError(() => new Error("declined")),
			);
			actions$ = of(CartActions.checkout());

			expect(run("checkout$")).toEqual(
				CartActions.checkoutFailure({ error: "declined" }),
			);
		});
	});

	describe("clearCart$", () => {
		it("skips the server call and succeeds when there is no cartId", () => {
			store.overrideSelector(cartFeature.selectCartId, null);
			actions$ = of(CartActions.clearCart());

			expect(run("clearCart$")).toEqual(CartActions.deleteCartSuccess());
			expect(cartService.deleteCart).not.toHaveBeenCalled();
		});

		it("deletes the server cart when a cartId exists", () => {
			store.overrideSelector(cartFeature.selectCartId, 100);
			cartService.deleteCart.mockReturnValue(of(cart({ id: 100 })));
			actions$ = of(CartActions.clearCart());

			expect(run("clearCart$")).toEqual(CartActions.deleteCartSuccess());
			expect(cartService.deleteCart).toHaveBeenCalledWith(100);
		});

		it("emits failure when the delete request fails", () => {
			store.overrideSelector(cartFeature.selectCartId, 100);
			cartService.deleteCart.mockReturnValue(
				throwError(() => new Error("busy")),
			);
			actions$ = of(CartActions.clearCart());

			expect(run("clearCart$")).toEqual(
				CartActions.deleteCartFailure({ error: "busy" }),
			);
		});
	});
});
