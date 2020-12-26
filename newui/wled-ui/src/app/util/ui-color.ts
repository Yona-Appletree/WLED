import * as chroma from "chroma-js";
import { Cached } from "./cached.decorator";
import { uint8 } from "./number.util";
import { isWledRgbColor, UInt8, WledOptionalRgbColor, WLedRgbColor } from "./wled.api";

export class UiPalette {
	constructor(
		public readonly stops: UiPaletteStop[]
	) {}

	@Cached()
	get cssGradient() {
		if (this.stops.length == 1) {
			return this.stops[0].color.cssColor;
		} else {
			return `linear-gradient(90deg, ${this.stops.map(it => it.cssGradientStop).join(",")})`;
		}
	}

	@Cached()
	get wledColors(): WLedRgbColor[] {
		return this.stops.map(it => it.color.wledColor)
	}

	static fromColors(
		input: Array<UiColorCompatible | null | undefined> | null | undefined,
		defualtColor = UiColor.BLACK
	) {
		const colors = (input || [])
			.map(it => UiColor.from(it));

		return new UiPalette(
			colors.map((color, index) => new UiPaletteStop(
				uint8((index / (colors.length - 1)) * 255),
				color || defualtColor
			))
		)
	}

	static fromBytes(
		bytes: number[]
	) {
		const stops: UiPaletteStop[] = [];
		for (let i = 0; i < bytes.length; i+=4) {
			const posByte   = uint8(bytes[i + 0]);
			const redByte   = uint8(bytes[i + 1]);
			const greenByte = uint8(bytes[i + 2]);
			const blueByte  = uint8(bytes[i + 3]);

			stops.push(new UiPaletteStop(
				posByte,
				new UiColor([
					redByte,
					greenByte,
					blueByte
				])
			))
		}

		return new UiPalette(stops);
	}

	withColorAtStop(
		index: number,
		newColor: UiColorCompatible | null | undefined
	) {
		return new UiPalette(
			[
				... this.stops.slice(0, index),
				new UiPaletteStop(
					this.stops[index].positionByte,
					UiColor.from(newColor) || UiColor.BLACK
				),
				... this.stops.slice(index + 1),
			]
		);
	}
}

export class UiPaletteStop {
	constructor(
		public readonly positionByte: UInt8,
		public readonly color: UiColor,
	) {}

	get positionFrac() { return this.positionByte / 255 }

	@Cached()
	get positionPercent() { return Math.round(this.positionFrac * 100) + "%" }

	@Cached()
	get cssGradientStop() { return this.color.cssColor + " " + this.positionPercent}
}

export class UiColor {
	static BLACK = new UiColor([0, 0, 0]);
	static WHITE = new UiColor([255, 255, 255]);

	static fromHex(color: number) {
		return new UiColor([
			uint8(color >> 16),
			uint8(color >> 8),
			uint8(color >> 0),
		])
	}

	static from(
		input: UiColorCompatible | null | undefined
	): UiColor | null {
		if (input instanceof UiColor) {
			return input;
		}
		else if (typeof input === "string") {
			return new UiColor(chroma(input).rgb() as WLedRgbColor)
		}
		else if(typeof input === "number") {
			return UiColor.fromHex(input);
		}
		else if(isWledRgbColor(input)) {
			return new UiColor(input);
		}

		return null;
	}

	constructor(
		public readonly color: WLedRgbColor
	) {}

	@Cached()
	get cssColor() {
		return `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`
	}

	@Cached()
	get wledColor() {
		return this.color;
	}
}

export type UiColorCompatible = UiColor | string | WledOptionalRgbColor | number;