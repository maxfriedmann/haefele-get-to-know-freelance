import { Component, input } from "@angular/core";

@Component({
	selector: "haefele-page-header",
	templateUrl: "./page-header.component.html",
})
export class PageHeaderComponent {
	title = input.required<string>();
	subTitle = input<string>();
	level = input<1 | 2>(1);
}
