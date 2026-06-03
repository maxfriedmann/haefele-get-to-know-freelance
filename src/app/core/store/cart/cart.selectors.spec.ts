import type { Product } from "../../models/product.model";
import {
	selectCartCount,
	selectCartEntries,
	selectCartTotal,
} from "./cart.selectors";

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

describe("cart selectors", () => {
	it("selectCartCount sums all quantities", () => {
		expect(selectCartCount.projector({ 1: 2, 2: 3 })).toBe(5);
		expect(selectCartCount.projector({})).toBe(0);
	});

	describe("selectCartEntries", () => {
		const entities = {
			1: product({ id: 1, price: 10 }),
			2: product({ id: 2, price: 5 }),
		};

		it("joins items with product data and computes line totals", () => {
			const entries = selectCartEntries.projector({ 1: 2, 2: 1 }, entities);
			expect(entries).toEqual([
				{ product: entities[1], quantity: 2, lineTotal: 20 },
				{ product: entities[2], quantity: 1, lineTotal: 5 },
			]);
		});

		it("drops items whose product is unknown", () => {
			const entries = selectCartEntries.projector({ 1: 1, 999: 1 }, entities);
			expect(entries.map((e) => e.product.id)).toEqual([1]);
		});
	});

	it("selectCartTotal sums all line totals", () => {
		const entries = [
			{ product: product({ id: 1 }), quantity: 2, lineTotal: 20 },
			{ product: product({ id: 2 }), quantity: 1, lineTotal: 5 },
		];
		expect(selectCartTotal.projector(entries)).toBe(25);
	});
});
