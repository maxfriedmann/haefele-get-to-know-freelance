import { createActionGroup, emptyProps, props } from "@ngrx/store";
import type { Cart } from "../../models/cart.model";

export const CartActions = createActionGroup({
	source: "Cart",
	events: {
		// local mutations
		"Add To Cart": props<{ productId: number }>(),
		"Remove From Cart": props<{ productId: number }>(),
		"Set Quantity": props<{ productId: number; quantity: number }>(),
		"Clear Cart": emptyProps(),
		// GET /carts/:id
		"Load Cart": props<{ id: number }>(),
		"Load Cart Success": props<{ cart: Cart }>(),
		"Load Cart Failure": props<{ error: string }>(),
		// POST /carts (create) or PUT /carts/:id (update)
		Checkout: emptyProps(),
		"Checkout Success": props<{ cartId: number }>(),
		"Checkout Failure": props<{ error: string }>(),
		// DELETE /carts/:id (triggered by Clear Cart when a server cart exists)
		"Delete Cart Success": emptyProps(),
		"Delete Cart Failure": props<{ error: string }>(),
	},
});
