import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { ProductsFacade } from "../../core/store/products/products.facade";
import { PageHeaderComponent } from "../../shared/components/page-header/page-header.component";
import { ProductGridComponent } from "../../shared/components/product-grid/product-grid.component";
import { StoreLoadingComponent } from "../../shared/components/store-loading/store-loading.component";

@Component({
	imports: [
		PageHeaderComponent,
		TranslatePipe,
		ProductGridComponent,
		AsyncPipe,
		RouterLink,
		StoreLoadingComponent,
	],
	templateUrl: "./home.component.html",
})
export class HomeComponent {
	private readonly productsFacade = inject(ProductsFacade);

	topRatedProducts$ = this.productsFacade.topRatedProducts$;
	status$ = this.productsFacade.status$;

	constructor() {
		this.productsFacade.load();
	}
}
