import { createSelector } from "@ngrx/store";
import { productsFeature } from "./products.feature";

export const selectTopRatedProducts = createSelector(
	productsFeature.selectAll,
	(products) =>
		[...products].sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 4),
);

export const selectSelectedProduct = createSelector(
	productsFeature.selectEntities,
	productsFeature.selectSelectedId,
	(entities, selectedId) =>
		selectedId != null ? entities[selectedId] : undefined,
);

export const selectRelatedProducts = createSelector(
	productsFeature.selectAll,
	selectSelectedProduct,
	(products, selected) =>
		selected
			? products.filter(
					(p) => p.category === selected.category && p.id !== selected.id,
				)
			: [],
);
