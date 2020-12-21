import { Component, ContentChildren, Output, EventEmitter, Input } from "@angular/core";

@Component({
	selector: 'wled-tab-bar-tab',
	template: "<ng-content></ng-content>",
	styleUrls: ['./wled-tab-bar-tab.component.scss' ],
	host: {
		"[class.is-selected]": "selected",
		"(click)": "clicked.emit()"
	}
})
export class WledTabBarTabComponent {
	@Input()
	selected = false;

	@Output()
	clicked = new EventEmitter<WledTabBarTabComponent>();

	constructor(
		public tabBar: WledTabBarComponent
	) {}
}


@Component({
	selector: 'wled-tab-bar',
	templateUrl: './wled-tab-bar.component.html',
	styleUrls: ['./wled-tab-bar.component.scss' ]
})
export class WledTabBarComponent {
	@ContentChildren(WledTabBarTabComponent)
	tabs: WledTabBarTabComponent[] = [];
}

