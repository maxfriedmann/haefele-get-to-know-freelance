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
		path: "cart",
		loadComponent: () =>
			import("./pages/cart/cart.component").then((m) => m.CartComponent),
	},
];
