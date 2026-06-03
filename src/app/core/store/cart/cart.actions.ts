import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const CartActions = createActionGroup({
	source: "Cart",
	events: {
		"Add To Cart": props<{ productId: number }>(),
		"Remove From Cart": props<{ productId: number }>(),
		"Set Quantity": props<{ productId: number; quantity: number }>(),
		"Clear Cart": emptyProps(),
		Checkout: emptyProps(),
		"Checkout Success": props<{ cartId: number }>(),
		"Checkout Failure": props<{ error: string }>(),
	},
});
