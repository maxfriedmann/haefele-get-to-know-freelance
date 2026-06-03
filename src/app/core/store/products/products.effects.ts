import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { catchError, filter, map, of, switchMap } from "rxjs";
import { ProductService } from "../../services/product.service";
import { ProductsActions } from "./products.actions";
import { productsFeature } from "./products.feature";

@Injectable()
export class ProductsEffects {
	private readonly actions$ = inject(Actions);
	private readonly productService = inject(ProductService);
	private readonly store = inject(Store);

	loadProducts$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProductsActions.loadProducts),
			// only load products if they haven't been loaded yet
			concatLatestFrom(() => this.store.select(productsFeature.selectStatus)),
			filter(([, status]) => status !== "loaded"),
			switchMap(() =>
				this.productService.getAll().pipe(
					map((products) => ProductsActions.loadProductsSuccess({ products })),
					catchError((error) =>
						of(
							ProductsActions.loadProductsFailure({
								error: error?.message ?? "Failed to load products",
							}),
						),
					),
				),
			),
		),
	);
}
