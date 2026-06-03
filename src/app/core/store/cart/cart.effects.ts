import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { catchError, exhaustMap, map, of } from "rxjs";
import { CartService } from "../../services/cart.service";
import { CartActions } from "./cart.actions";
import { cartFeature } from "./cart.feature";

@Injectable()
export class CartEffects {
	private readonly actions$ = inject(Actions);
	private readonly store = inject(Store);
	private readonly cartService = inject(CartService);

	checkout$ = createEffect(() =>
		this.actions$.pipe(
			ofType(CartActions.checkout),
			concatLatestFrom(() => this.store.select(cartFeature.selectItems)),
			// exhaustMap (instead of switchMap) ensures that if the user clicks "Checkout" multiple times quickly, we won't trigger multiple API calls in parallel. Instead, subsequent clicks will be ignored until the current checkout process completes.
			exhaustMap(([, items]) => {
				const products = Object.entries(items).map(([productId, quantity]) => ({
					productId: Number(productId),
					quantity,
				}));
				return this.cartService
					.createCart({ userId: 1, date: new Date().toISOString(), products })
					.pipe(
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
}
