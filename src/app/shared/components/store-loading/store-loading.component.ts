import { Component, input } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import type { FeatureLoadingStatus } from "../../../core/store/common";

@Component({
	selector: "haefele-store-loading",
	templateUrl: "./store-loading.component.html",
	imports: [TranslatePipe],
})
export class StoreLoadingComponent {
	status = input.required<FeatureLoadingStatus>();
	error = input<string>();
}
