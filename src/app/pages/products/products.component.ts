import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { ProductsFacade } from "../../core/store/products/products.facade";
import { PageHeaderComponent } from "../../shared/components/page-header/page-header.component";
import { ProductGridComponent } from "../../shared/components/product-grid/product-grid.component";
import { StoreLoadingComponent } from "../../shared/components/store-loading/store-loading.component";

@Component({
	imports: [
		AsyncPipe,
		PageHeaderComponent,
		ProductGridComponent,
		TranslatePipe,
		StoreLoadingComponent,
	],
	templateUrl: "./products.component.html",
})
export class ProductsComponent {
	private readonly productsFacade = inject(ProductsFacade);

	products$ = this.productsFacade.products$;
	productsLoadingStatus$ = this.productsFacade.status$;
	productsLoadingError$ = this.productsFacade.error$;

	constructor() {
		this.productsFacade.load();
	}
}
