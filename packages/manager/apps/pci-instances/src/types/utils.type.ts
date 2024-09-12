export type Primitive =
  | undefined
  | null
  | boolean
  | string
  | number
  | (() => any);
export type DeepReadonlyMap<K, V> = ReadonlyMap<
  DeepReadonly<K>,
  DeepReadonly<V>
>;
export type DeepReadonlyObject<T> = {
  readonly [K in keyof T]: DeepReadonly<T[K]>;
};
export type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>;
export type DeepReadonlySet<T> = ReadonlySet<DeepReadonly<T>>;

// Ensure readonly recursivity that is not handled by TS engine
export type DeepReadonly<T> = T extends Primitive
  ? T
  : T extends Map<infer K, infer V>
  ? DeepReadonlyMap<K, V>
  : T extends Record<string, unknown>
  ? DeepReadonlyObject<T>
  : T extends Array<infer U>
  ? DeepReadonlyArray<U>
  : T extends Set<infer M>
  ? DeepReadonlySet<M>
  : unknown;
