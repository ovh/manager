import { KeyValuePair } from '@secret-manager/components/form/keyValuesEditor/KeyValuesEditorItem';

/**
 * Checks if an object is made of simple key/value pairs only.
 *
 * @param obj - The object to check
 * @returns true if the object contains only simple key/value pairs, false otherwise
 *
 * @example
 * isSimpleKeyValueObject({ key1: "value1", key2: "value2" }) // true
 * isSimpleKeyValueObject({}) // true
 * isSimpleKeyValueObject({ key: { nested: "object" } }) // false
 * isSimpleKeyValueObject({ key: [1, 2, 3] }) // false
 */
function isSimpleKeyValueObject(obj: unknown): boolean {
  // Check if the input is an object and not null
  if (obj === null || typeof obj !== 'object') {
    return false;
  }

  // Check if it's an array (arrays are objects in JavaScript)
  if (Array.isArray(obj)) {
    return false;
  }

  // Check if it's a Date, RegExp, or other special object types
  if (obj instanceof Date || obj instanceof RegExp || obj instanceof Error) {
    return false;
  }

  // Check if it's a function
  if (typeof obj === 'function') {
    return false;
  }

  // Check all property values using Object.values
  const values = Object.values(obj);
  return values.every((value) => {
    // Check if the value is a primitive type, null, or undefined
    // Functions are objects but should be excluded
    return (
      value === null ||
      value === undefined ||
      (typeof value !== 'object' && typeof value !== 'function')
    );
  });
}

export function isSimpleKeyValueObjectFromString(obj: string): boolean {
  try {
    const parsedObj = JSON.parse(obj);
    return isSimpleKeyValueObject(parsedObj);
  } catch (e) {
    return false;
  }
}

/**
 * Formats a string into an array of key-value pairs.
 * @param obj - The string to parse
 * @returns The key-value pairs
 *
 * @example
 * formatKeyValuePairsFromString('{"key1":"value1","key2":"value2"}') // [{ key: 'key1', value: 'value1' }, { key: 'key2', value: 'value2' }]
 * formatKeyValuePairsFromString('') // []
 * formatKeyValuePairsFromString('{ invalid: "json" }') // []
 */
export function formatKeyValuePairsFromString(obj: string): KeyValuePair[] {
  try {
    const parsedObj = JSON.parse(obj);
    if (!isSimpleKeyValueObject(parsedObj)) {
      return [];
    }
    return Object.entries(parsedObj).map(([key, value]) => ({
      key: String(key),
      value: String(value),
    }));
  } catch (e) {
    return [];
  }
}

/**
 * Formats an array of key-value pairs into a string.
 * @param pairs - The key-value pairs
 * @returns The string
 *
 * @example
 * formatStringFromKeyValuePairs([{ key: 'key1', value: 'value1' }, { key: 'key2', value: 'value2' }]) // '{"key1":"value1","key2":"value2"}'
 * formatStringFromKeyValuePairs([]) // ''
 */
export function formatStringFromKeyValuePairs(pairs: KeyValuePair[]): string {
  const keyValueObject = Object.fromEntries(
    pairs.map(({ key, value }) => [key, value]),
  );
  return JSON.stringify(keyValueObject);
}
