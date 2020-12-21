export interface Dictionary<T> {
	[key: string]: T;
}

export type TypedDictionary<K extends string, T> = {[key in K]: T}
