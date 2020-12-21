import { Component, EventEmitter, Input, Output } from "@angular/core";
import { UiWledPalette, UiWledPaletteGroupInfo } from "../../service/led-control-api.service";

@Component({
	selector: 'wled-palette-picker',
	templateUrl: './wled-palette-picker.component.html',
	styleUrls: ['./wled-palette-picker.component.scss' ]
})
export class WledPalettePickerComponent {
	@Input()
	paletteGroups: UiWledPaletteGroupInfo[] = [];

	@Input()
	selectedPalette: UiWledPalette | null = null;

	@Output()
	selectedPaletteChange = new EventEmitter<UiWledPalette>();

	selectPalette(pal: UiWledPalette) {
		this.selectedPalette = pal;
		this.selectedPaletteChange.emit(pal);
	}

	groupIdFor(index: number, group: UiWledPaletteGroupInfo) {
		return group.name;
	}

	palIdFor(index: number, palette: UiWledPalette) {
		return palette.wledIndex;
	}
}
