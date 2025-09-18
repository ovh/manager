/**
 * Log an informational message with a standard prefix.
 *
 * @param {string} msg - The message to log.
 * @returns {void}
 */
export function logInfo(msg) {
  console.log(`[manager-static-analysis-kit] ${msg}`);
}

/**
 * Log a warning message with a standard prefix.
 *
 * @param {string} msg - The message to log.
 * @returns {void}
 */
export function logWarn(msg) {
  console.warn(`⚠️  [manager-static-analysis-kit] ${msg}`);
}

/**
 * Log an error message with a standard prefix.
 *
 * @param {string} msg - The message to log.
 * @returns {void}
 */
export function logError(msg) {
  console.error(`❌ [manager-static-analysis-kit] ${msg}`);
}
