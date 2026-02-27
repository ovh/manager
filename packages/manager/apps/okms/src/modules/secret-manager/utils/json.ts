/**
 * Parses a JSON string and returns a typed object.
 * Returns an empty object if the input is null, undefined, or causes an error.
 */
export function safeJsonParse<T = object>(json: string): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return {} as T;
  }
}

/**
 * Converts a value to a JSON string.
 * Returns an empty string if the input is null, undefined, or causes an error.
 */
export const safeJsonStringify = (value: unknown): string => {
  if (value === undefined || value === null) {
    return '';
  }

  try {
    const result = JSON.stringify(value);
    return result === undefined ? '' : result;
  } catch {
    return '';
  }
};
