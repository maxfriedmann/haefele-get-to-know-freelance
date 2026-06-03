import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";
import { TranslatePipe } from "@ngx-translate/core";
import { ProductsActions } from "../../core/store/products/products.actions";
import { productsFeature } from "../../core/store/products/products.feature";
import { selectTopRatedProducts } from "../../core/store/products/products.selectors";
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
	private readonly store = inject(Store);

	topRatedProducts$ = this.store.select(selectTopRatedProducts);
	status$ = this.store.select(productsFeature.selectStatus);

	constructor() {
		this.store.dispatch(ProductsActions.loadProducts());
	}
}
