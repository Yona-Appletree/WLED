export function copyCanvas2d(canvas: HTMLCanvasElement) {
	const copy = document.createElement("canvas");
	copy.width = canvas.width;
	copy.height = canvas.height;

	copy.getContext("2d")?.drawImage(canvas, 0, 0);
	return copy;
}