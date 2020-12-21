
import { asSequence } from "sequency";
import { TypedDictionary } from "./dictionary.util";
import { pairOf } from "./pair.util";
import { objectAsSequence } from "./sequency-extensions";

/**
 * Function for building "info maps" and associated arrays, where there is an array of "infos", each with an id-property
 *
 * A map is then built from this, for each lookup by id.
 */
export function buildInfoMap<
	TKeyName extends string,
	TKeyValues extends string,
	TInfo extends object & Record<TKeyName, TKeyValues>
>(
	keyName: TKeyName,
	inputMap: TypedDictionary<TKeyValues, Omit<TInfo, TKeyName>>
): InfoMap<TKeyName, TKeyValues, TInfo> {
	const infoArray = objectAsSequence(inputMap)
		.map(([type, option]): TInfo => ({ [keyName]: type as TKeyValues, ... (option as object) } as TInfo))
		.toArray();

	const infoMap = asSequence(infoArray)
		.map(it => pairOf(it[keyName], it))
		.toObject() as TypedDictionary<TKeyValues, TInfo>;

	return {
		map: infoMap,
		values: infoArray,
		keys: infoArray.map(it => it[keyName])
	}
}

interface InfoMap<
	TKeyName extends string,
	TKeyValues extends string,
	TInfo extends object & Record<TKeyName, TKeyValues>
> {
	map: TypedDictionary<TKeyValues, TInfo>;
	values: TInfo[];
	keys: TKeyValues[];
}