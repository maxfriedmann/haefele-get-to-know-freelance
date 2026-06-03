import { Component, inject, input, signal } from "@angular/core";
import { Store } from "@ngrx/store";
import { TranslatePipe } from "@ngx-translate/core";
import { CartActions } from "../../../core/store/cart/cart.actions";

@Component({
	selector: "haefele-add-to-cart-button",
	templateUrl: "./add-to-cart-button.component.html",
	imports: [TranslatePipe],
})
export class AddToCartButtonComponent {
	// in a real-world app we would most likely keep this component dumb and emit click events to the parent component which would need to handle the dispatching. This would make testing easier.
	private readonly store = inject(Store);

	productId = input.required<number>();
	/** daisyUI color modifier shown in the idle state (e.g. "btn-secondary", "btn-primary"). */
	colorClass = input<string>("btn-secondary");
	/** layout/size classes that stay constant across states (e.g. "w-full", "btn-block btn-lg"). */
	sizeClass = input<string>("w-full");

	showAddedToCartMessage = signal<boolean>(false);

	addToCart(event: MouseEvent) {
		// stop the click from bubbling to a surrounding routerLink (e.g. the product card).
		event.stopPropagation();
		this.store.dispatch(CartActions.addToCart({ productId: this.productId() }));
		// the reducer mutates local state synchronously, so we can confirm instantly.
		this.showAddedToCartMessage.set(true);
		setTimeout(() => this.showAddedToCartMessage.set(false), 2000);
	}
}
