import { Component, EventEmitter, Input, Output } from "@angular/core";
import { UiColor, UiColorCompatible, UiPalette } from "../../util/ui-color";

@Component({
	selector: 'wled-palette-editor',
	templateUrl: './wled-palette-editor.component.html',
	styleUrls: ['./wled-palette-editor.component.scss' ],
	host: {
		"[class.is-disabled]": "! enabled"
	}
})
export class WledPaletteEditorComponent {
	palette: UiPalette = new UiPalette([]);

	@Input()
	set colors(colors: Array<UiColorCompatible | null | undefined> | null | undefined) {
		this.palette = UiPalette.fromColors(colors, UiColor.WHITE);
		this.selectedIndex = Math.min(this.palette.stops.length - 1, this.selectedIndex);
	}

	@Output()
	paletteChange = new EventEmitter<UiPalette>();

	@Input()
	enabled = true;

	selectedIndex = 0;

	updateSelectedColor(
		newColor: UiColorCompatible | null | undefined
	) {
		this.palette = this.palette.withColorAtStop(
			this.selectedIndex,
			newColor
		);

		this.paletteChange.emit(this.palette);
	}
}
