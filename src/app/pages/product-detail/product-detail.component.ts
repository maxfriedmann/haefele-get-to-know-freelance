import { AsyncPipe, CurrencyPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { ProductsFacade } from "../../core/store/products/products.facade";
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
	private readonly productsFacade = inject(ProductsFacade);

	productsLoadingStatus$ = this.productsFacade.status$;
	productsLoadingError$ = this.productsFacade.error$;
	product$ = this.productsFacade.selectedProduct$;
	relatedProducts$ = this.productsFacade.relatedProducts$;

	constructor() {
		// we could load just the product details for the selected product, but since we also show related products its worth it to load all products at once, see README.md for more details
		this.productsFacade.load();

		this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
			const id = Number(params.get("productId"));
			if (!Number.isNaN(id)) {
				this.productsFacade.select(id);
			}
		});
	}
}
