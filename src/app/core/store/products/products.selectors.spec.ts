import type { Product } from "../../models/product.model";
import {
	selectRelatedProducts,
	selectSelectedProduct,
	selectTopRatedProducts,
} from "./products.selectors";

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

describe("products selectors", () => {
	describe("selectTopRatedProducts", () => {
		it("returns the highest-rated products first, capped at 4", () => {
			const products = [1, 2, 3, 4, 5].map((id) =>
				product({ id, rating: { rate: id, count: 1 } }),
			);
			const top = selectTopRatedProducts.projector(products);
			expect(top.map((p) => p.id)).toEqual([5, 4, 3, 2]);
		});

		it("does not mutate the input array", () => {
			const products = [
				product({ id: 1, rating: { rate: 1, count: 1 } }),
				product({ id: 2, rating: { rate: 9, count: 1 } }),
			];
			selectTopRatedProducts.projector(products);
			expect(products.map((p) => p.id)).toEqual([1, 2]);
		});
	});

	describe("selectSelectedProduct", () => {
		it("returns the entity matching the selected id", () => {
			const entities = { 1: product({ id: 1 }), 2: product({ id: 2 }) };
			expect(selectSelectedProduct.projector(entities, 2)?.id).toBe(2);
		});

		it("returns undefined when nothing is selected", () => {
			expect(selectSelectedProduct.projector({}, null)).toBeUndefined();
		});
	});

	describe("selectRelatedProducts", () => {
		it("returns same-category products excluding the selected one", () => {
			const selected = product({ id: 1, category: "a" });
			const products = [
				selected,
				product({ id: 2, category: "a" }),
				product({ id: 3, category: "b" }),
			];
			const related = selectRelatedProducts.projector(products, selected);
			expect(related.map((p) => p.id)).toEqual([2]);
		});

		it("returns an empty array when nothing is selected", () => {
			const products = [product({ id: 1 })];
			expect(selectRelatedProducts.projector(products, undefined)).toEqual([]);
		});
	});
});
