import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";
import { CART_API_BASE } from "../constants";
import type { Cart } from "../models/cart.model";

@Injectable({ providedIn: "root" })
export class CartService {
	private readonly http = inject(HttpClient);

	getCart(id: number): Observable<Cart> {
		return this.http.get<Cart>(`${CART_API_BASE}/carts/${id}`);
	}

	createCart(cart: Omit<Cart, "id">): Observable<Cart> {
		return this.http.post<Cart>(`${CART_API_BASE}/carts`, cart);
	}

	updateCart(id: number, cart: Omit<Cart, "id">): Observable<Cart> {
		return this.http.put<Cart>(`${CART_API_BASE}/carts/${id}`, cart);
	}

	deleteCart(id: number): Observable<Cart> {
		return this.http.delete<Cart>(`${CART_API_BASE}/carts/${id}`);
	}
}
