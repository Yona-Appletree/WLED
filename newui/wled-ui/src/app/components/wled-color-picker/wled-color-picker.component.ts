import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild
} from "@angular/core";

import iro from '@jaames/iro';
import { UiColor, UiColorCompatible } from "../../util/ui-color";

@Component({
	selector: 'wled-color-picker',
	templateUrl: './wled-color-picker.component.html',
	styleUrls: ['./wled-color-picker.component.scss' ]
})
export class WledColorPickerComponent implements OnInit, AfterViewInit, OnDestroy {
	private colorPicker: iro.ColorPicker| null = null;

	presetColors = [
		"#000000",
		"#ffffff",

		"#ff0000",
		"#ffff00",
		"#00ff00",
		"#00ffff",
		"#0000ff",
		"#ff00ff",

		"#ffa000",
		"#ffc800",
		"#ffe0a0",
	].map(it => UiColor.from(it)?.cssColor);

	@ViewChild("pickerContainer")
	pickerContainer!: ElementRef<HTMLElement>;

	@Input()
	defaultColor = "#000";

	@Input()
	debounce = false;

	@Input()
	displayInline = false;

	private _color: string = this.defaultColor;

	@Input()
	set color(color: UiColorCompatible | null) {
		this._color = UiColor.from(color)?.cssColor || this.defaultColor;

		if (this.colorPicker) {
			this.colorPicker.setColors([ this._color ]);
		}
	}

	get color() {
		return this._color;
	}

	@Output()
	colorChange = new EventEmitter<UiColor>();

	constructor() {}

	ngAfterViewInit(): void {
		this.colorPicker = iro.ColorPicker(
			this.pickerContainer.nativeElement,

			{
				// Set the size of the color picker
				width: 320,

				// Set the initial color to pure red
				color: this._color
			}
		);

		this.colorPicker.on(
			"color:change",
			(newColor: iro.Color) => {
				this.emitColorDebounced();
				this._color = newColor.hexString;
			}
		)
	}

	ngOnDestroy(): void {}

	ngOnInit(): void {
	}

	useColor(
		preset: UiColorCompatible | null | undefined,
		sendEvents: boolean = true
	) {
		this.color = UiColor.from(preset)?.cssColor || this.defaultColor;

		if (sendEvents) {
			this.emitColorDebounced();
		}
	}

	private _debounceTimeout: number | null = null;
	private _debounceMs = 100;

	private emitColorDebounced() {
		if (this._debounceTimeout !== null) {
			clearTimeout(this._debounceTimeout);
		}

		this._debounceTimeout = setTimeout(
			() => {
				this.colorChange.emit(UiColor.from(this.color || this.defaultColor) !);
				this._debounceTimeout = null;
			},
			this._debounceMs
		)
	}
}