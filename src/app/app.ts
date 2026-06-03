import {
	AsyncPipe,
	isPlatformBrowser,
	NgTemplateOutlet,
} from "@angular/common";
import {
	Component,
	type ElementRef,
	inject,
	PLATFORM_ID,
	viewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
	NavigationStart,
	Router,
	RouterLink,
	RouterLinkActive,
	RouterOutlet,
} from "@angular/router";
import { Store } from "@ngrx/store";
import { TranslatePipe } from "@ngx-translate/core";
import { filter } from "rxjs";
import { selectCartCount } from "./core/store/cart/cart.selectors";
import { LanguageChooserComponent } from "./shared/components/language-chooser/language-chooser.component";

@Component({
	selector: "app-root",
	imports: [
		NgTemplateOutlet,
		RouterOutlet,
		RouterLink,
		RouterLinkActive,
		TranslatePipe,
		LanguageChooserComponent,
		AsyncPipe,
	],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {
	private readonly router = inject(Router);
	private readonly platformId = inject(PLATFORM_ID);
	private readonly scrollContainer =
		viewChild.required<ElementRef<HTMLElement>>("scrollContainer");

	cartCount$ = inject(Store).select(selectCartCount);

	constructor() {
		if (isPlatformBrowser(this.platformId)) {
			this.router.events
				.pipe(
					filter((event) => event instanceof NavigationStart),
					takeUntilDestroyed(),
				)
				.subscribe(() => {
					this.scrollContainer().nativeElement.scrollTo({
						top: 0,
						behavior: "smooth",
					});
				});
		}
	}

	// daisyUI's focus-based dropdown closes when the focused element is blurred.
	closeMobileMenu() {
		(document.activeElement as HTMLElement | null)?.blur();
	}
}
