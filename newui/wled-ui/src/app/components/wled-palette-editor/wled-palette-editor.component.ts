import { Component, EventEmitter, Input, Output } from "@angular/core";
import { UiColor, UiColorCompatible, UiPalette } from "../../util/ui-color";

@Component({
	selector: 'wled-palette-editor',
	templateUrl: './wled-palette-editor.component.html',
	styleUrls: ['./wled-palette-editor.component.scss' ]
})
export class WledPaletteEditorComponent {
	palette: UiPalette = new UiPalette([]);

	@Input()
	set colors(colors: Array<UiColorCompatible | null>) {
		this.palette = UiPalette.fromColors(colors);
	}

	@Output()
	paletteChange = new EventEmitter<UiPalette>();

	selectedIndex = 0;

	presetColors = [
		"#ff0000",
		"#ffa000",
		"#ffc800",
		"#ffe0a0",
		"#ffffff",
		"#000000",
		"#ff00ff",
		"#0000ff",
		"#00ffc8",
		"#08ff00",
	].map(it => UiColor.from(it));

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
