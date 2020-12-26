import { Component, EventEmitter, Input, Output } from "@angular/core";
import { UiStripSegment, UiWledPalette, UiWledPaletteGroupInfo } from "../../service/led-control-api.service";

@Component({
	selector: 'wled-palette-picker',
	templateUrl: './wled-palette-picker.component.html',
	styleUrls: ['./wled-palette-picker.component.scss' ]
})
export class WledPalettePickerComponent {
	@Input()
	segment: UiStripSegment | null = null;

	@Input()
	selectedPalette: UiWledPalette | null = null;

	@Output()
	selectedPaletteChange = new EventEmitter<UiWledPalette>();

	@Input()
	allowCustomPalettes = false;

	get paletteGroups() {
		return (this.allowCustomPalettes
		       ? this.segment?.paletteGroups.values
		       : this.segment?.presetPaletteGroups) || [];
	}

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
