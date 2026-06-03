import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { catchError, exhaustMap, map, of, switchMap } from "rxjs";
import { CartService } from "../../services/cart.service";
import { CartActions } from "./cart.actions";
import { cartFeature } from "./cart.feature";

@Injectable()
export class CartEffects {
	private readonly actions$ = inject(Actions);
	private readonly store = inject(Store);
	private readonly cartService = inject(CartService);

	// GET /carts/:id — load an existing cart from the server into the store
	loadCart$ = createEffect(() =>
		this.actions$.pipe(
			ofType(CartActions.loadCart),
			switchMap(({ id }) =>
				this.cartService.getCart(id).pipe(
					map((cart) => CartActions.loadCartSuccess({ cart })),
					catchError((error) =>
						of(
							CartActions.loadCartFailure({
								error: error?.message ?? "Could not load cart",
							}),
						),
					),
				),
			),
		),
	);

	// POST /carts to create the cart the first time, PUT /carts/:id to update it afterwards.
	// exhaustMap ignores rapid repeat clicks until the in-flight request finishes.
	checkout$ = createEffect(() =>
		this.actions$.pipe(
			ofType(CartActions.checkout),
			concatLatestFrom(() => [
				this.store.select(cartFeature.selectItems),
				this.store.select(cartFeature.selectCartId),
			]),
			exhaustMap(([, items, cartId]) => {
				const products = Object.entries(items).map(([productId, quantity]) => ({
					productId: Number(productId),
					quantity,
				}));
				const payload = {
					userId: 1,
					date: new Date().toISOString(),
					products,
				};
				const request$ =
					cartId == null
						? this.cartService.createCart(payload)
						: this.cartService.updateCart(cartId, payload);
				return request$.pipe(
					map((cart) => CartActions.checkoutSuccess({ cartId: cart.id })),
					catchError((error) =>
						of(
							CartActions.checkoutFailure({
								error: error?.message ?? "Checkout failed",
							}),
						),
					),
				);
			}),
		),
	);

	// DELETE /carts/:id — Clear Cart removes the server cart too (when one exists)
	clearCart$ = createEffect(() =>
		this.actions$.pipe(
			ofType(CartActions.clearCart),
			concatLatestFrom(() => this.store.select(cartFeature.selectCartId)),
			exhaustMap(([, cartId]) =>
				cartId == null
					? of(CartActions.deleteCartSuccess())
					: this.cartService.deleteCart(cartId).pipe(
							map(() => CartActions.deleteCartSuccess()),
							catchError((error) =>
								of(
									CartActions.deleteCartFailure({
										error: error?.message ?? "Could not delete cart",
									}),
								),
							),
						),
			),
		),
	);
}
