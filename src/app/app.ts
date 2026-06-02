import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { LanguageChooserComponent } from "./shared/components/language-chooser/language-chooser.component";

@Component({
	selector: "app-root",
	imports: [
		RouterOutlet,
		RouterLink,
		RouterLinkActive,
		TranslatePipe,
		LanguageChooserComponent,
	],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {}
