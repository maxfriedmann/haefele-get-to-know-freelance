import { Component, computed, input } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
	selector: "haefele-rating",
	templateUrl: "./rating.component.html",
	imports: [TranslatePipe],
})
export class RatingComponent {
	rate = input.required<number>();
	count = input.required<number>();

	// Snap to the nearest half star, then express as a 0-100% fill width.
	fillPercent = computed(() => (Math.round(this.rate() * 2) / 2 / 5) * 100);
}
