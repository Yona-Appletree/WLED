/**
 * Explicit creation of a [A, B] typed-pair, disambiguating any cases (e.g. when using sequency) where TypeScript
 * might want to create a generic array instead of a tuple-type.
 *
 * @param a
 * @param b
 */
export function pairOf<A, B>(a: A, b: B): Pair<A, B> {
	return [a, b];
}

export type Pair<A, B> = [A, B];
