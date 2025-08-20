import { readFileSync } from 'fs';
import { promises as fs } from 'node:fs';

import { AppPackageJson } from '../types/commons/workspace-type.js';

/**
 * Load and parse a JSON file into a typed object.
 *
 * @template T - The expected type of the parsed JSON object.
 * @param filePath - Absolute or relative path to the JSON file.
 * @returns A promise resolving to the parsed object, typed as `T`.
 *
 * @throws Will throw if the file cannot be read or contains invalid JSON.
 *
 * @example
 * ```ts
 * interface Config {
 *   port: number;
 *   debug: boolean;
 * }
 *
 * const config = await loadJson<Config>('./config.json');
 * console.log(config.port);
 * ```
 */
export async function loadJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

/**
 * Safely parse JSON with runtime validation.
 */
export function parseAppPackageJson(filePath: string): AppPackageJson {
  const raw = readFileSync(filePath, 'utf8');
  const parsed: unknown = JSON.parse(raw);

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('name' in parsed) ||
    typeof (parsed as { name: unknown }).name !== 'string'
  ) {
    throw new Error(`Invalid package.json at ${filePath}`);
  }

  // At this point, name is guaranteed to be string
  const { name, regions } = parsed as { name: string; regions?: string[] };

  return { name, regions };
}
