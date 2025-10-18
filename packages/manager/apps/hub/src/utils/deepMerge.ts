type DeepMergeArrayMode = 'replace' | 'concat';

type Primitive = string | number | boolean | null | undefined;

type DeepMerge<T, U> = T extends Primitive
  ? U
  : T extends Array<infer TItem>
    ? U extends Array<infer UItem>
      ? Array<TItem | UItem>
      : U
    : T extends Record<string, unknown>
      ? U extends Record<string, unknown>
        ? {
            [K in keyof (T & U)]: K extends keyof U
              ? K extends keyof T
                ? DeepMerge<T[K], U[K]>
                : U[K]
              : K extends keyof T
                ? T[K]
                : never;
          }
        : U
      : U;

function isRecord(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

export function deepMerge<T extends Record<string, unknown>, U extends Record<string, unknown>>(
  target: T,
  source: U,
  options: { arrayMode?: DeepMergeArrayMode } = {},
): DeepMerge<T, U> {
  const { arrayMode = 'replace' } = options;
  const output: Record<string, unknown> = { ...target };

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    const targetValue = output[key];

    if (isRecord(sourceValue) && isRecord(targetValue)) {
      output[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>,
        options,
      );
    } else if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
      output[key] = arrayMode === 'concat' ? [...targetValue, ...sourceValue] : [...sourceValue];
    } else {
      output[key] = sourceValue;
    }
  });

  return output as DeepMerge<T, U>;
}
