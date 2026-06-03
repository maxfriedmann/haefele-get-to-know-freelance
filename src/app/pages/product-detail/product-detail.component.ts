import { AsyncPipe, CurrencyPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";
import { TranslatePipe } from "@ngx-translate/core";
import type { Product } from "../../core/models/product.model";
import { ProductsActions } from "../../core/store/products/products.actions";
import {
	selectRelatedProducts,
	selectSelectedProduct,
} from "../../core/store/products/products.selectors";
import { PageHeaderComponent } from "../../shared/components/page-header/page-header.component";
import { ProductGridComponent } from "../../shared/components/product-grid/product-grid.component";
import { RatingComponent } from "../../shared/components/rating/rating.component";

@Component({
	imports: [
		AsyncPipe,
		CurrencyPipe,
		RouterLink,
		ProductGridComponent,
		TranslatePipe,
		RatingComponent,
		PageHeaderComponent,
	],
	templateUrl: "./product-detail.component.html",
})
export class ProductDetailComponent {
	private readonly route = inject(ActivatedRoute);
	private readonly store = inject(Store);

	product$ = this.store.select(selectSelectedProduct);
	relatedProducts$ = this.store.select(selectRelatedProducts);

	constructor() {
		this.store.dispatch(ProductsActions.loadProducts());

		this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
			const id = Number(params.get("productId"));
			if (!Number.isNaN(id)) {
				this.store.dispatch(ProductsActions.selectProduct({ id }));
			}
		});
	}

	addToCart(product: Product) {
		console.log("Adding to cart:", product);
	}
}
