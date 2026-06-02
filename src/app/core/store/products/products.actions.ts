import { createActionGroup, emptyProps, props } from "@ngrx/store";
import type { Product } from "../../models/product.model";

export const ProductsActions = createActionGroup({
	source: "Products",
	events: {
		"Load Products": emptyProps(),
		"Load Products Success": props<{ products: Product[] }>(),
		"Load Products Failure": props<{ error: string }>(),
		"Select Product": props<{ id: number }>(),
	},
});
