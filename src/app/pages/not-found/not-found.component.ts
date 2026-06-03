import { Component, inject, RESPONSE_INIT } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
	imports: [RouterLink, TranslatePipe],
	templateUrl: "./not-found.component.html",
})
export class NotFoundComponent {
	constructor() {
		// On SSR, return a real 404 status so crawlers and clients see the
		// page for what it is. RESPONSE_INIT is null in the browser.
		const responseInit = inject(RESPONSE_INIT, { optional: true });
		if (responseInit) {
			responseInit.status = 404;
		}
	}
}
