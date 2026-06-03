import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";
import type { Product } from "../models/product.model";

@Injectable({ providedIn: "root" })
export class ProductService {
	private readonly http = inject(HttpClient);

	// Product data is a static asset served from this app's own origin
	// (public/products.json). Relative URLs are made absolute during SSR by
	// baseUrlInterceptor; in the browser they resolve against the page origin.
	getAll(): Observable<Product[]> {
		return this.http.get<Product[]>("/products.json");
	}

	getById(id: number): Observable<Product> {
		return this.http.get<Product>(`/products/${id}.json`);
	}
}
