import type { Product } from "../../models/product.model";
import { ProductsActions } from "./products.actions";
import { initialProductsState, productsFeature } from "./products.feature";

const product = (over: Partial<Product> = {}): Product => ({
	id: 1,
	title: "Test product",
	price: 10,
	description: "desc",
	category: "cat",
	image: "img",
	rating: { rate: 4, count: 2 },
	...over,
});

const { reducer } = productsFeature;

describe("productsFeature reducer", () => {
	it("starts idle with no products", () => {
		expect(initialProductsState.status).toBe("idle");
		expect(initialProductsState.ids).toEqual([]);
	});

	it("moves to loading on loadProducts", () => {
		const state = reducer(initialProductsState, ProductsActions.loadProducts());
		expect(state.status).toBe("loading");
		expect(state.error).toBeNull();
	});

	it("does not reload when already loaded", () => {
		const loaded = { ...initialProductsState, status: "loaded" as const };
		const state = reducer(loaded, ProductsActions.loadProducts());
		expect(state).toBe(loaded);
	});

	it("stores products and marks loaded on success", () => {
		const products = [product({ id: 1 }), product({ id: 2 })];
		const state = reducer(
			initialProductsState,
			ProductsActions.loadProductsSuccess({ products }),
		);
		expect(state.status).toBe("loaded");
		expect(state.ids).toEqual([1, 2]);
		expect(state.entities[1]).toEqual(products[0]);
	});

	it("records the error on failure", () => {
		const state = reducer(
			initialProductsState,
			ProductsActions.loadProductsFailure({ error: "boom" }),
		);
		expect(state.status).toBe("error");
		expect(state.error).toBe("boom");
	});

	it("stores the selected id", () => {
		const state = reducer(
			initialProductsState,
			ProductsActions.selectProduct({ id: 7 }),
		);
		expect(state.selectedId).toBe(7);
	});
});
