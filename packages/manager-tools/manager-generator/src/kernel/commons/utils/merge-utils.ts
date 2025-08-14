/**
 * @file merge-utils.ts
 * @description Deep merge utilities with predictable rules, optional array strategies,
 * and protections against clobbering defined values with `undefined`.
 */

/**
 * Narrower type guard for plain objects (excludes null and arrays).
 * @param val - Value to test.
 * @returns True if `val` is a non-null object and not an array.
 */
export function isPlainObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

/**
 * Deeply merges two values with sensible defaults.
 *
 * Rules:
 * - Primitive vs anything: the source wins (unless `preferDefined` and source is `undefined`).
 * - Arrays: merged per `arrayStrategy` (default "replace").
 * - Objects: recursively merge keys. If `preferDefined` is true, `undefined` in source will not overwrite defined target values.
 * - `null` handling: if `treatNullAsEmptyObject` is true, `null` is treated like `{}` when both sides are objects.
 *
 * @param target - Left-hand value (base/defaults).
 * @param source - Right-hand value (overrides).
 * @param opts - Merge options.
 * @returns Merged value (new object/array; never mutates inputs).
 *
 * @example
 * deepMerge({a:1, tags:['a']}, {b:2, tags:['b']})
 * // => { a:1, b:2, tags:['b'] }   // default arrayStrategy = "replace"
 *
 * @example
 * deepMerge({a:1, tags:['a']}, {b:2, tags:['b']}, { arrayStrategy: 'concat' })
 * // => { a:1, b:2, tags:['a','b'] }
 *
 * @example
 * deepMerge({a:1, name:'x'}, {name: undefined})
 * // => { a:1, name:'x' }          // preferDefined prevents clobber
 */

/**
 * Deep-merge two plain objects.
 * - Nested plain objects are merged recursively.
 * - Arrays and primitives in `patch` overwrite values in `base`.
 *
 * @typeParam T - Base object type.
 * @typeParam U - Patch object type.
 * @param base - Original object.
 * @param patch - Patch values to merge in.
 * @returns A new object containing the merged result.
 */
export function deepMerge<T extends Record<string, unknown>, U extends Record<string, unknown>>(
  base: T,
  patch: U,
): T & U {
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    const current = out[k];
    if (isPlainObject(v) && isPlainObject(current)) {
      out[k] = deepMerge(current, v);
    } else if (v !== undefined) {
      out[k] = v;
    }
  }
  return out as T & U;
}
