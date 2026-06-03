import type { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "",
		loadComponent: () =>
			import("./pages/home/home.component").then((m) => m.HomeComponent),
	},
	{
		path: "products",
		loadComponent: () =>
			import("./pages/products/products.component").then(
				(m) => m.ProductsComponent,
			),
	},
	{
		path: "products/:productId",
		loadComponent: () =>
			import("./pages/product-detail/product-detail.component").then(
				(m) => m.ProductDetailComponent,
			),
	},
	{
		path: "cart",
		loadComponent: () =>
			import("./pages/cart/cart.component").then((m) => m.CartComponent),
	},
	{
		path: "**",
		loadComponent: () =>
			import("./pages/not-found/not-found.component").then(
				(m) => m.NotFoundComponent,
			),
	},
];
