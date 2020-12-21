import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";

import iro from '@jaames/iro';
import { UiColor, UiColorCompatible } from "../../util/ui-color";

@Component({
	selector: 'wled-color-picker',
	templateUrl: './wled-color-picker.component.html',
	styleUrls: ['./wled-color-picker.component.scss' ]
})
export class WledColorPickerComponent implements OnInit, AfterViewInit, OnDestroy {
	private colorPicker: iro.ColorPicker| null = null;

	@Input()
	defaultColor = "#FFFFFF";

	@Input()
	debounce = true;

	private _color: string = this.defaultColor;

	@Input()
	set color(color: string) {
		this._color = color;

		if (this.colorPicker) {
			this.colorPicker.setColors([ color ]);
		}
	}

	get color() {
		return this._color;
	}

	@Output()
	colorChange = new EventEmitter<string>();

	constructor(
		private elemRef: ElementRef<HTMLElement>
	) {}

	ngAfterViewInit(): void {
		this.colorPicker = iro.ColorPicker(
			this.elemRef.nativeElement,

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
	private _debounceMs = 500;

	private emitColorDebounced() {
		if (this._debounceTimeout !== null) {
			clearTimeout(this._debounceTimeout);
		}

		this._debounceTimeout = setTimeout(
			() => {
				this.colorChange.emit(this.color);
				this._debounceTimeout = null;
			},
			this._debounceMs
		)
	}
}