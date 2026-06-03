import { Injectable, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { ProductsActions } from "./products.actions";
import { productsFeature } from "./products.feature";
import {
	selectRelatedProducts,
	selectSelectedProduct,
	selectTopRatedProducts,
} from "./products.selectors";

/**
 * Public API for the products feature. Components depend on this facade instead
 * of the Store/actions/selectors directly, keeping NgRx an implementation detail.
 */
@Injectable({ providedIn: "root" })
export class ProductsFacade {
	private readonly store = inject(Store);

	// reads
	readonly products$ = this.store.select(productsFeature.selectAll);
	readonly status$ = this.store.select(productsFeature.selectStatus);
	readonly error$ = this.store.select(productsFeature.selectError);
	readonly selectedProduct$ = this.store.select(selectSelectedProduct);
	readonly relatedProducts$ = this.store.select(selectRelatedProducts);
	readonly topRatedProducts$ = this.store.select(selectTopRatedProducts);

	// writes
	load(): void {
		this.store.dispatch(ProductsActions.loadProducts());
	}

	select(id: number): void {
		this.store.dispatch(ProductsActions.selectProduct({ id }));
	}
}
