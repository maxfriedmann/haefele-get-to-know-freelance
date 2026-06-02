import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";
import { FAKE_STORE_API_BASE } from "../constants";
import type { Product } from "../models/product.model";

@Injectable({ providedIn: "root" })
export class ProductService {
	private readonly http = inject(HttpClient);

	getAll(): Observable<Product[]> {
		return this.http.get<Product[]>(`${FAKE_STORE_API_BASE}/products`);
	}

	getById(id: number): Observable<Product> {
		return this.http.get<Product>(`${FAKE_STORE_API_BASE}/products/${id}`);
	}
}
