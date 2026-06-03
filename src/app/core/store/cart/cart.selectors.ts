import { createSelector } from "@ngrx/store";
import type { Product } from "../../models/product.model";
import { productsFeature } from "../products/products.feature";
import { cartFeature } from "./cart.feature";

export interface CartEntry {
	product: Product;
	quantity: number;
	lineTotal: number;
}

// total number of items (sum of quantities) — for the navbar badge
export const selectCartCount = createSelector(
	cartFeature.selectItems,
	(items) => Object.values(items).reduce((sum, qty) => sum + qty, 0),
);

// cross-slice: join cart items with product data for display
export const selectCartEntries = createSelector(
	cartFeature.selectItems,
	productsFeature.selectEntities,
	(items, productEntities): CartEntry[] =>
		Object.entries(items)
			.map(([productId, quantity]) => {
				const product = productEntities[Number(productId)];
				return product
					? { product, quantity, lineTotal: product.price * quantity }
					: null;
			})
			.filter((entry): entry is CartEntry => entry !== null),
);

export const selectCartTotal = createSelector(selectCartEntries, (entries) =>
	entries.reduce((sum, entry) => sum + entry.lineTotal, 0),
);
