/* eslint-disable no-undef */

/**
 * ANSI color escape codes for styled console output.
 */
const COLORS = {
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

/**
 * Symbols used for different log levels.
 */
const SYMBOLS = {
  info: 'ℹ',
  success: '✔',
  warn: '⚠',
  error: '✖',
  debug: '•',
};

/**
 * Supported logger modes.
 *
 * - `"default"`: Logs go to stdout/stderr as usual
 * - `"stderr"`: All logs (info/success/warn/debug) are redirected to stderr
 * - `"silent"`: Suppress **all** logs (info/success/warn/debug/error)
 *
 * @typedef {"default"|"stderr"|"silent"} LoggerMode
 */

/** @type {LoggerMode} */
let mode = 'stderr'; // default: stderr, safe for jq pipes

/**
 * Change the logging mode at runtime.
 *
 * Example:
 * ```js
 * setLoggerMode("silent");   // suppress all logs
 * setLoggerMode("default");  // stdout/stderr normal
 * setLoggerMode("stderr");   // stderr-only (default)
 * ```
 *
 * @param {LoggerMode} newMode - New mode ("default" | "stderr" | "silent").
 */
export function setLoggerMode(newMode) {
  mode = newMode;
}

/**
 * Get the current logger mode.
 *
 * @returns {LoggerMode} The current logger mode.
 */
export function getLoggerMode() {
  return mode;
}

/**
 * Format a log message with color, symbol, and optional extra arguments.
 *
 * @param {string} color - ANSI escape code for the color to apply.
 * @param {string} symbol - Symbol prefix for the log (e.g., ✔, ℹ, ⚠, ✖).
 * @param {string} msg - Main log message.
 * @param {any[]} args - Additional values to append after the message.
 * @returns {string} A formatted string with colors and symbol.
 */
function formatMessage(color, symbol, msg, args) {
  const extra = args.length ? ' ' + args.map(String).join(' ') : '';
  return `${color}${symbol} ${msg}${extra}${COLORS.reset}`;
}

/**
 * Dispatch a log message depending on the current logger mode.
 *
 * @param {(msg: string) => void} stream - Console stream function (console.log, console.error, etc.).
 * @param {string} color - ANSI color code to apply.
 * @param {string} symbol - Symbol prefix for the log.
 * @param {string} msg - Main log message.
 * @param {any[]} args - Additional arguments to append.
 */
// eslint-disable-next-line max-params
function output(stream, color, symbol, msg, args) {
  if (mode === 'silent') return; // disable everything
  const formatted = formatMessage(color, symbol, msg, args);
  if (mode === 'stderr') {
    console.error(formatted);
  } else {
    stream(formatted);
  }
}

/**
 * Minimal, dependency-free logger with colored output and symbols.
 * Honors the current mode set via {@link setLoggerMode}.
 */
export const logger = {
  /**
   * Log an informational message (blue ℹ).
   *
   * @param {string} msg - The main log message.
   * @param {...any} args - Additional values to log.
   */
  info(msg, ...args) {
    output(console.log, COLORS.blue, SYMBOLS.info, msg, args);
  },

  /**
   * Log a success message (green ✔).
   *
   * @param {string} msg - The main log message.
   * @param {...any} args - Additional values to log.
   */
  success(msg, ...args) {
    output(console.log, COLORS.green, SYMBOLS.success, msg, args);
  },

  /**
   * Log a warning message (yellow ⚠).
   *
   * @param {string} msg - The main log message.
   * @param {...any} args - Additional values to log.
   */
  warn(msg, ...args) {
    output(console.warn, COLORS.yellow, SYMBOLS.warn, msg, args);
  },

  /**
   * Log an error message (red ✖).
   * Suppressed if mode is `"silent"`.
   *
   * @param {string} msg - The main log message.
   * @param {...any} args - Additional values to log.
   */
  error(msg, ...args) {
    output(console.error, COLORS.red, SYMBOLS.error, msg, args);
  },

  /**
   * Log a debug message (gray •).
   *
   * @param {string} msg - The main log message.
   * @param {...any} args - Additional values to log.
   */
  debug(msg, ...args) {
    output(console.debug, COLORS.gray, SYMBOLS.debug, msg, args);
  },
};
