import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { TranslatePipe } from "@ngx-translate/core";
import { ProductsActions } from "../../core/store/products/products.actions";
import { productsFeature } from "../../core/store/products/products.feature";
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
	private readonly store = inject(Store);

	products$ = this.store.select(productsFeature.selectAll);
	productsLoadingStatus$ = this.store.select(productsFeature.selectStatus);
	productsLoadingError$ = this.store.select(productsFeature.selectError);

	constructor() {
		this.store.dispatch(ProductsActions.loadProducts());
	}
}
