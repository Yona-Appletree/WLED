import { UInt8 } from "./wled.api";

export function uint8(
	input: number | string
): UInt8 {
	if (typeof input === "string") {
		return (parseInt(input) & 0xFF) as UInt8;
	} else {
		return (input & 0xFF) as UInt8;
	}
}

export function uint8FromFrac(
	input: number | string
): UInt8 {
	if (typeof input === "string") {
		return ((parseInt(input) * 255) & 0xFF) as UInt8;
	} else {
		return ((input * 255) & 0xFF) as UInt8;
	}
}