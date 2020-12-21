import { UInt8 } from "./wled.api";

export function uint8(
	input: number
) {
	return (input & 0xFF) as UInt8;
}