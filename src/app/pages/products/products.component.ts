import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { ProductService } from "../../core/services/product.service";
import { PageHeaderComponent } from "../../shared/components/page-header/page-header.component";
import { ProductGridComponent } from "../../shared/components/product-grid/product-grid.component";

@Component({
	imports: [
		AsyncPipe,
		PageHeaderComponent,
		ProductGridComponent,
		TranslatePipe,
	],
	templateUrl: "./products.component.html",
})
export class ProductsComponent {
	private readonly productService: ProductService = inject(ProductService);

	products$ = this.productService.getAll();
}
