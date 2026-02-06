import process from 'node:process';

/**
 * Indicates whether the current process is running in a Continuous Integration (CI) environment.
 *
 * This flag is considered enabled if any of the following are true:
 * - `CI` is explicitly set to `"true"`
 * - `GITHUB_ACTIONS` is explicitly set to `"true"`
 * - `CDS_WORKSPACE` is defined (non-null / non-undefined), commonly used in OVH CDS pipelines
 *
 * @type {boolean}
 */
export const isCI =
  process.env.CI === 'true' ||
  process.env.GITHUB_ACTIONS === 'true' ||
  process.env.CDS_WORKSPACE != null;

/**
 * Raw value of the `SKIP_POST_INSTALL` environment variable.
 *
 * Note: this is a string (or `undefined`) as provided by Node.js. Use
 * {@link isEnvOptionEnabled} to interpret it as a boolean toggle.
 *
 * Common accepted truthy forms (via {@link isEnvOptionEnabled}): `"1"`, `"true"`, `"yes"`, `"y"`, `"on"`.
 *
 * @type {string|undefined}
 */
export const skipPostInstall = process.env.SKIP_POST_INSTALL;

/**
 * Interprets an environment option value as a boolean toggle.
 *
 * Treats the following values (case-insensitive) as `true`:
 * - `"1"`, `"true"`, `"yes"`, `"y"`, `"on"`
 *
 * Everything else (including `undefined`, `null`, `"0"`, `"false"`, `"no"`) is `false`.
 *
 * @param {unknown} option - The env var value to interpret (usually a string or undefined).
 * @returns {boolean} `true` if the option is considered enabled; otherwise `false`.
 *
 * @example
 * isEnvOptionEnabled(process.env.SKIP_POST_INSTALL); // => true/false
 *
 * @example
 * isEnvOptionEnabled('TRUE'); // => true
 *
 * @example
 * isEnvOptionEnabled(undefined); // => false
 */
export const isEnvOptionEnabled = (option) =>
  ['1', 'true', 'yes', 'y', 'on'].includes(String(option ?? '').toLowerCase());
