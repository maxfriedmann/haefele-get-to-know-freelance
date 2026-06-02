import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { map } from "rxjs";
import { ProductService } from "../../core/services/product.service";
import { PageHeaderComponent } from "../../shared/components/page-header/page-header.component";
import { ProductGridComponent } from "../../shared/components/product-grid/product-grid.component";

@Component({
	imports: [
		PageHeaderComponent,
		TranslatePipe,
		ProductGridComponent,
		AsyncPipe,
		RouterLink,
	],
	templateUrl: "./home.component.html",
})
export class HomeComponent {
	productService = inject(ProductService);

	topRatedProducts$ = this.productService
		.getAll()
		.pipe(
			map((products) =>
				[...products].sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 4),
			),
		);
}
