export function timeoutPromise(timeoutMs: number = 0): Promise<void> {
	return new Promise<void>(resolve => setTimeout(resolve, timeoutMs));
}

export function animationFramePromise(): Promise<number> {
	return new Promise<number>(resolve => requestAnimationFrame(resolve));
}