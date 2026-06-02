import { AsyncPipe, CurrencyPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { filter, map, switchMap } from "rxjs";
import { ProductService } from "../../core/services/product.service";
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
	activatedRoute = inject(ActivatedRoute);
	productService = inject(ProductService);

	product$ = this.activatedRoute.paramMap.pipe(
		map((params) => {
			const productIdParam = params.get("productId");
			if (!productIdParam) {
				throw new Error("No productId provided in route parameters");
			}
			const productId: number = productIdParam
				? parseInt(productIdParam, 10)
				: NaN;
			if (Number.isNaN(productId)) {
				throw new Error("Invalid productId provided in route parameters");
			}
			return productId;
		}),
		switchMap((productId) => this.productService.getById(productId)),
	);

	relatedProducts$ = this.product$.pipe(
		filter((product) => !!product),
		switchMap((product) =>
			this.productService.getAll().pipe(
				filter((products) => !!products),
				map((products) =>
					products.filter(
						(p) => p.category === product.category && p.id !== product.id,
					),
				),
			),
		),
	);

	addToCart(product: any) {
		console.log("Adding to cart:", product);
	}
}
