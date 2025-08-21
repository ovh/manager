/**
 * Safely read a string field from a generic object.
 *
 * @param obj Source object
 * @param key Property key to read
 * @returns The string if valid, else undefined
 */
export function readOptionalString(obj: Record<string, unknown>, key: string): string | undefined {
  const v = obj[key];
  return typeof v === 'string' ? v : undefined;
}
