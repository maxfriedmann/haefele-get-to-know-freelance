import { Component, computed, inject, input, signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { debounceTime } from "rxjs";
import type { Product } from "../../../core/models/product.model";
import { ProductCardComponent } from "../product-card/product-card.component";

type SortBy = "none" | "priceAsc" | "priceDesc" | "titleAsc" | "titleDesc";

@Component({
	selector: "haefele-product-grid",
	templateUrl: "./product-grid.component.html",
	imports: [ProductCardComponent, TranslatePipe, FormsModule],
})
export class ProductGridComponent {
	router = inject(Router);

	products = input<Product[]>();

	readonly sortOptions: { value: SortBy; label: string }[] = [
		{ value: "none", label: "products.sort.none" },
		{ value: "titleAsc", label: "products.sort.titleAsc" },
		{ value: "titleDesc", label: "products.sort.titleDesc" },
		{ value: "priceAsc", label: "products.sort.priceAsc" },
		{ value: "priceDesc", label: "products.sort.priceDesc" },
	];

	sortBy = signal<SortBy>("none");
	searchTerm = signal<string>("");

	currentSortLabel = computed(
		() => this.sortOptions.find((o) => o.value === this.sortBy())?.label ?? "",
	);

	selectSort(value: SortBy) {
		this.sortBy.set(value);
		// daisyUI's focus-based dropdown closes when the focused element is blurred.
		(document.activeElement as HTMLElement | null)?.blur();
	}

	visibleProducts = computed(() => {
		const term = this.searchTerm().toLowerCase().trim(); // as long as ALL products are loaded, we can search without debouncing
		let products = [...(this.products() ?? [])];
		if (term) {
			products = products.filter((p) => p.title.toLowerCase().includes(term));
		}
		switch (this.sortBy()) {
			case "priceAsc":
				return products.sort((a, b) => a.price - b.price);
			case "priceDesc":
				return products.sort((a, b) => b.price - a.price);
			case "titleAsc":
				return products.sort((a, b) => a.title.localeCompare(b.title));
			case "titleDesc":
				return products.sort((a, b) => b.title.localeCompare(a.title));
			default:
				return products;
		}
	});

	detailsClick(product: Product) {
		this.router.navigate(["/products", product.id]);
	}

	addToCartClick(product: Product) {}
}
