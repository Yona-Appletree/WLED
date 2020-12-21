import Sequence, { asSequence, extendSequence } from "sequency";
import { Dictionary, TypedDictionary } from "./dictionary.util";
import { Pair } from "./pair.util";


export class WledSequencyExtensions {
	toObject<K extends string, V>(
		this: Sequence<[K, V]>,
		map?: TypedDictionary<K, V>
	) {
		const result = {} as TypedDictionary<K, V>;
		this.forEach(([key, value]) => result[key] = value);
		return result;
	}

	toSetSequence<T>(this: Sequence<T>): Sequence<T> {
		return asSequence(this.toSet());
	}
}

declare module "sequency" {
	// tslint:disable-next-line:no-empty-interface
	export default interface Sequence<T> extends WledSequencyExtensions {
	}
}

extendSequence(WledSequencyExtensions);

export function objectAsSequence<
	TValue
>(
	obj: Dictionary<TValue>
): Sequence<Pair<string, TValue>> {
	return asSequence(Object.entries(obj) as Array<Pair<string, TValue>>);
}

export function objectAsSequenceTyped<
	TKey extends string,
	TValue
>(
	obj: TypedDictionary<TKey, TValue>
): Sequence<Pair<TKey, TValue>> {
	return asSequence(Object.entries(obj) as Array<Pair<TKey, TValue>>);
}
