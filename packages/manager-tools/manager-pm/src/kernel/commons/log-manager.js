const COLORS = {
  reset: "\x1b[0m",
  gray: "\x1b[90m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

const SYMBOLS = {
  info: "ℹ",
  success: "✔",
  warn: "⚠",
  error: "✖",
};

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
  const extra = args.length ? " " + args.map(String).join(" ") : "";
  return `${color}${symbol} ${msg}${extra}${COLORS.reset}`;
}

/**
 * Minimal, dependency-free logger with colored output and symbols.
 * Provides standard logging levels: info, success, warn, error, debug.
 */
export const logger = {
  /**
   * Log an informational message (blue ℹ).
   *
   * @param {string} msg - The main log message.
   * @param {...any} args - Additional values to log.
   */
  info(msg, ...args) {
    console.log(formatMessage(COLORS.blue, SYMBOLS.info, msg, args));
  },

  /**
   * Log a success message (green ✔).
   *
   * @param {string} msg - The main log message.
   * @param {...any} args - Additional values to log.
   */
  success(msg, ...args) {
    console.log(formatMessage(COLORS.green, SYMBOLS.success, msg, args));
  },

  /**
   * Log a warning message (yellow ⚠).
   *
   * @param {string} msg - The main log message.
   * @param {...any} args - Additional values to log.
   */
  warn(msg, ...args) {
    console.warn(formatMessage(COLORS.yellow, SYMBOLS.warn, msg, args));
  },

  /**
   * Log an error message (red ✖).
   *
   * @param {string} msg - The main log message.
   * @param {...any} args - Additional values to log.
   */
  error(msg, ...args) {
    console.error(formatMessage(COLORS.red, SYMBOLS.error, msg, args));
  },

  /**
   * Log a debug message (gray •).
   *
   * @param {string} msg - The main log message.
   * @param {...any} args - Additional values to log.
   */
  debug(msg, ...args) {
    console.debug(formatMessage(COLORS.gray, "•", msg, args));
  },
};
