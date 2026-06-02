import { createEntityAdapter, type EntityState } from "@ngrx/entity";
import { createFeature, createReducer, on } from "@ngrx/store";
import type { Product } from "../../models/product.model";
import type { FeatureLoadingStatus } from "../common";
import { ProductsActions } from "./products.actions";

export interface ProductsState extends EntityState<Product> {
	selectedId: number | null;
	status: FeatureLoadingStatus;
	error: string | null;
}

export const productsAdapter = createEntityAdapter<Product>();

export const initialProductsState: ProductsState =
	productsAdapter.getInitialState({
		selectedId: null,
		status: "idle",
		error: null,
	});

export const productsFeature = createFeature({
	name: "products",
	reducer: createReducer(
		initialProductsState,
		on(ProductsActions.loadProducts, (state) => ({
			...state,
			status: "loading",
			error: null,
		})),
		on(ProductsActions.loadProductsSuccess, (state, { products }) =>
			productsAdapter.setAll(products, { ...state, status: "loaded" }),
		),
		on(ProductsActions.loadProductsFailure, (state, { error }) => ({
			...state,
			status: "error",
			error,
		})),
		on(ProductsActions.selectProduct, (state, { id }) => ({
			...state,
			selectedId: id,
		})),
	),
	extraSelectors: ({ selectProductsState }) => ({
		...productsAdapter.getSelectors(selectProductsState),
	}),
});
