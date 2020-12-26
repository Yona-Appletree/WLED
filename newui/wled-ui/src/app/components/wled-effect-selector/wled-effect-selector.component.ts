import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from "@angular/core";
import { effectModeInfoMap, WledEffectModeInfo } from "../../util/data/wled-patterns.data";
import { WledPopupComponent } from "../wled-popup/wled-popup.component";

@Component({
	selector: 'wled-effect-selector',
	templateUrl: './wled-effect-selector.component.html',
	styleUrls: ['./wled-effect-selector.component.scss' ]
})
export class WledEffectSelectorComponent {
	_selectedEffect: WledEffectModeInfo | null = null;

	@ViewChild("dropdown")
	dropdown!: WledPopupComponent;

	@Input()
	set selectedEffect(value: WledEffectModeInfo | null | undefined) {
		this._selectedEffect = value || null;
	}
	get selectedEffect() {
		return this._selectedEffect;
	}

	@Output()
	effectSelected = new EventEmitter<WledEffectModeInfo>();

	effectModeInfoMap = effectModeInfoMap;

	constructor() {}

	selectEffect(effectInfo: WledEffectModeInfo) {
		this.effectSelected.emit(effectInfo);

		this.dropdown.closePopup();
	}
}

