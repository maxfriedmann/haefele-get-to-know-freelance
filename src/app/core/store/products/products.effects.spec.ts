import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import type { Action } from "@ngrx/store";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { type Observable, of, throwError } from "rxjs";
import type { Product } from "../../models/product.model";
import { ProductService } from "../../services/product.service";
import { ProductsActions } from "./products.actions";
import { ProductsEffects } from "./products.effects";
import { productsFeature } from "./products.feature";

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

describe("ProductsEffects", () => {
	let actions$: Observable<Action>;
	let productService: { getAll: ReturnType<typeof vi.fn> };
	let store: MockStore;

	beforeEach(() => {
		productService = { getAll: vi.fn() };
		TestBed.configureTestingModule({
			providers: [
				ProductsEffects,
				provideMockActions(() => actions$),
				provideMockStore(),
				{ provide: ProductService, useValue: productService },
			],
		});
		store = TestBed.inject(MockStore);
		store.overrideSelector(productsFeature.selectStatus, "idle");
	});

	it("loads products and emits success", () => {
		const products = [product()];
		productService.getAll.mockReturnValue(of(products));
		actions$ = of(ProductsActions.loadProducts());

		let result: Action | undefined;
		TestBed.inject(ProductsEffects).loadProducts$.subscribe((a) => {
			result = a;
		});

		expect(productService.getAll).toHaveBeenCalled();
		expect(result).toEqual(ProductsActions.loadProductsSuccess({ products }));
	});

	it("emits failure with the error message when the service throws", () => {
		productService.getAll.mockReturnValue(
			throwError(() => new Error("network down")),
		);
		actions$ = of(ProductsActions.loadProducts());

		let result: Action | undefined;
		TestBed.inject(ProductsEffects).loadProducts$.subscribe((a) => {
			result = a;
		});

		expect(result).toEqual(
			ProductsActions.loadProductsFailure({ error: "network down" }),
		);
	});

	it("skips loading when products are already loaded", () => {
		store.overrideSelector(productsFeature.selectStatus, "loaded");
		actions$ = of(ProductsActions.loadProducts());

		let emitted = false;
		TestBed.inject(ProductsEffects).loadProducts$.subscribe(() => {
			emitted = true;
		});

		expect(emitted).toBe(false);
		expect(productService.getAll).not.toHaveBeenCalled();
	});
});
