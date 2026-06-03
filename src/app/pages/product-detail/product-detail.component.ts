import { AsyncPipe, CurrencyPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";
import { TranslatePipe } from "@ngx-translate/core";
import { ProductsActions } from "../../core/store/products/products.actions";
import { productsFeature } from "../../core/store/products/products.feature";
import {
	selectRelatedProducts,
	selectSelectedProduct,
} from "../../core/store/products/products.selectors";
import { AddToCartButtonComponent } from "../../shared/components/add-to-cart-button/add-to-cart-button.component";
import { PageHeaderComponent } from "../../shared/components/page-header/page-header.component";
import { ProductGridComponent } from "../../shared/components/product-grid/product-grid.component";
import { RatingComponent } from "../../shared/components/rating/rating.component";
import { StoreLoadingComponent } from "../../shared/components/store-loading/store-loading.component";

@Component({
	imports: [
		AsyncPipe,
		CurrencyPipe,
		RouterLink,
		ProductGridComponent,
		TranslatePipe,
		RatingComponent,
		PageHeaderComponent,
		StoreLoadingComponent,
		AddToCartButtonComponent,
	],
	templateUrl: "./product-detail.component.html",
})
export class ProductDetailComponent {
	private readonly route = inject(ActivatedRoute);
	private readonly store = inject(Store);

	productsLoadingStatus$ = this.store.select(productsFeature.selectStatus);
	productsLoadingError$ = this.store.select(productsFeature.selectError);
	product$ = this.store.select(selectSelectedProduct);
	relatedProducts$ = this.store.select(selectRelatedProducts);

	constructor() {
		// we could load just the product details for the selected product, but since we also show related products its worth it to load all products at once, see README.md for more details
		this.store.dispatch(ProductsActions.loadProducts());

		this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
			const id = Number(params.get("productId"));
			if (!Number.isNaN(id)) {
				this.store.dispatch(ProductsActions.selectProduct({ id }));
			}
		});
	}
}
