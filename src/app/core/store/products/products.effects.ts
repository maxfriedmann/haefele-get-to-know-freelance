import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { ProductService } from "../../services/product.service";
import { ProductsActions } from "./products.actions";

@Injectable()
export class ProductsEffects {
	private readonly actions$ = inject(Actions);
	private readonly productService = inject(ProductService);

	loadProducts$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProductsActions.loadProducts),
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
