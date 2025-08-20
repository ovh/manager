import { readFileSync } from "node:fs";
import { promises as fs } from "node:fs";
import { logger } from "./log-manager.js";

/**
 * Load and parse a JSON file into a typed object.
 *
 * @template T - The expected type of the parsed JSON object.
 * @param {string} filePath - Absolute or relative path to the JSON file.
 * @returns {Promise<T>} A promise resolving to the parsed object, typed as `T`.
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
export async function loadJson(filePath) {
  logger.debug(`loadJson(file="${filePath}")`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    logger.info(`✅ Successfully loaded JSON from ${filePath}`);
    logger.debug(
      `Sample keys: ${Object.keys(parsed).slice(0, 5).join(", ")}${
        Object.keys(parsed).length > 5 ? " ..." : ""
      }`
    );
    return parsed;
  } catch (err) {
    logger.error(`❌ Failed to load JSON file ${filePath}: ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    throw err;
  }
}

/**
 * Safely parse a package.json file with runtime validation.
 *
 * Ensures the parsed object has a valid `name` (string).
 * Optionally returns `regions` if defined.
 *
 * @param {string} filePath - Path to the package.json file.
 * @returns {{ name: string, regions?: unknown }} Object with at least `name`.
 *
 * @throws Will throw if the file cannot be read, parsed, or validated.
 */
export function parseAppPackageJson(filePath) {
  logger.debug(`parseAppPackageJson(file="${filePath}")`);
  try {
    const raw = readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("name" in parsed) ||
      typeof parsed.name !== "string"
    ) {
      logger.error(`❌ Invalid package.json at ${filePath}`);
      throw new Error(`Invalid package.json at ${filePath}`);
    }

    const { name, regions } = parsed;
    logger.info(`📦 Parsed package.json: name="${name}"`);
    if (regions) {
      logger.debug(`Regions field detected in ${filePath}`);
    }

    return { name, regions };
  } catch (err) {
    logger.error(`❌ Failed to parse package.json ${filePath}: ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    throw err;
  }
}
