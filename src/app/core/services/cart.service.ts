import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";
import { CART_API_BASE } from "../constants";
import type { Cart } from "../models/cart.model";

@Injectable({ providedIn: "root" })
export class CartService {
	private readonly http = inject(HttpClient);

	createCart(cart: Omit<Cart, "id">): Observable<Cart> {
		return this.http.post<Cart>(`${CART_API_BASE}/carts`, cart);
	}
}
