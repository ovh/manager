import { KeyValuePair } from '../KeyValuesEditorItem';

/**
 * Checks if an object is made of simple key/value pairs only.
 *
 * @param obj - The object to check
 * @returns true if the object contains only simple key/value pairs, false otherwise
 *
 * @example
 * isKeyValueObject({ key1: "value1", key2: "value2" }) // true
 * isKeyValueObject({}) // true
 * isKeyValueObject({ key: { nested: "object" } }) // false
 * isKeyValueObject({ key: [1, 2, 3] }) // false
 */
export function isKeyValueObject(obj: unknown): boolean {
  // Check if the input is a not null object
  if (obj === null || typeof obj !== 'object') {
    return false;
  }

  if (
    Array.isArray(obj) ||
    typeof obj === 'function' ||
    obj instanceof Date ||
    obj instanceof RegExp ||
    obj instanceof Error
  ) {
    return false;
  }

  // Check all values
  const values = Object.values(obj);
  return values.every((value) => {
    // Ok if the value is a primitive type, null, or undefined
    return (
      value === null ||
      value === undefined ||
      (typeof value !== 'object' && typeof value !== 'function')
    );
  });
}

/**
 * Checks if a string is a valid JSON object that contains only simple key/value pairs.
 * @param obj - The string to check
 * @returns false if the string is NOT a valid JSON object
 * @returns false if the string is NOT an object with key/value pairs
 * @returns true if the string is an object with key/value pairs
 * @returns true if the string is empty
 */
export function isStringValidForKeyValueForm(obj: string | undefined): boolean {
  try {
    if (!obj) {
      return true;
    }
    const parsedObj = JSON.parse(obj);
    return isKeyValueObject(parsedObj);
  } catch (e) {
    return false;
  }
}

/**
 * Formats a key value object string into an array of key-value pairs.
 * @param obj - The string to parse
 * @returns The key-value pairs
 *
 * @example
 * formatKeyValueArrayFromString('{"key1":"value1","key2":"value2"}') // [{ key: 'key1', value: 'value1' }, { key: 'key2', value: 'value2' }]
 * formatKeyValueArrayFromString('') // []
 * formatKeyValueArrayFromString('{ invalid: "json" }') // []
 */
export function formatKeyValueArrayFromString(obj: string): KeyValuePair[] {
  const emptyPair: KeyValuePair = { key: '', value: '' };
  try {
    const parsedObj = JSON.parse(obj);
    if (!isKeyValueObject(parsedObj)) {
      return [emptyPair];
    }
    return Object.entries(parsedObj).map(([key, value]) => ({
      key: String(key),
      value: String(value),
    }));
  } catch (e) {
    return [emptyPair];
  }
}

/**
 * Formats an array of key-value pairs into a key value object string.
 * @param pairs - The key-value pairs
 * @returns The string
 *
 * @example
 * formatStringFromKeyValueArray([{ key: 'key1', value: 'value1' }, { key: 'key2', value: 'value2' }]) // '{"key1":"value1","key2":"value2"}'
 * formatStringFromKeyValueArray([]) // ''
 */
export function formatStringFromKeyValueArray(pairs: KeyValuePair[]): string {
  if (pairs.length === 0) {
    return '';
  }
  return JSON.stringify(
    Object.fromEntries(pairs.map(({ key, value }) => [key, value])),
  );
}
