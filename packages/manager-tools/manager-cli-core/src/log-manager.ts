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
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  black: '\x1b[30m',
} as const;

type ColorCode = (typeof COLORS)[keyof typeof COLORS];

/**
 * Symbols used for different log levels.
 */
const SYMBOLS = {
  info: 'ℹ',
  success: '✔',
  warn: '⚠',
  error: '✖',
  debug: '•',
  log: '',
} as const;

type LogSymbol = (typeof SYMBOLS)[keyof typeof SYMBOLS];

/**
 * Supported logger modes.
 *
 * - "default": Logs go to stdout/stderr as usual
 * - "stderr": All logs (info/success/warn/debug) go to stderr
 * - "silent": Suppress **all** logs
 */
export type LoggerMode = 'default' | 'stderr' | 'silent' | 'plain';

let mode: LoggerMode = 'default'; // default: stderr, safe for jq pipes

/**
 * Change the logging mode.
 */
export function setLoggerMode(newMode: LoggerMode): void {
  mode = newMode;
}

/**
 * Get the current logger mode.
 */
export function getLoggerMode(): LoggerMode {
  return mode;
}

/**
 * Format a message with color, symbol and args.
 */
function formatMessage(color: ColorCode, symbol: LogSymbol, msg: string, args: unknown[]): string {
  if (mode === 'plain') {
    const extra = args.length ? ' ' + args.map(String).join(' ') : '';
    return `${msg}${extra}`;
  }

  const symbolPart = symbol ? `${symbol} ` : '';
  const extra = args.length ? ' ' + args.map(String).join(' ') : '';
  return `${color}${symbolPart}${msg}${extra}${COLORS.reset}`;
}

/**
 * Dispatch the log depending on the current mode.
 */

function output(
  stream: (msg: string) => void,
  color: ColorCode,
  symbol: LogSymbol,
  msg: string,
  args: unknown[],
): void {
  if (mode === 'silent') return;
  const formatted = formatMessage(color, symbol, msg, args);
  if (mode === 'stderr') {
    console.error(formatted);
  } else {
    stream(formatted);
  }
}

/**
 * Minimal, dependency-free logger with colored output and symbols.
 */
export const logger = {
  clear(): void {
    console.clear();
  },

  log(msg: string, ...args: unknown[]): void {
    output(console.log, COLORS.cyan, SYMBOLS.log, msg, args);
  },

  info(msg: string, ...args: unknown[]): void {
    output(console.log, COLORS.blue, SYMBOLS.info, msg, args);
  },

  success(msg: string, ...args: unknown[]): void {
    output(console.log, COLORS.green, SYMBOLS.success, msg, args);
  },

  warn(msg: string, ...args: unknown[]): void {
    output(console.warn, COLORS.yellow, SYMBOLS.warn, msg, args);
  },

  error(msg: string, ...args: unknown[]): void {
    output(console.error, COLORS.red, SYMBOLS.error, msg, args);
  },

  debug(msg: string, ...args: unknown[]): void {
    output(console.debug, COLORS.gray, SYMBOLS.debug, msg, args);
  },
} as const;

export type Logger = typeof logger;
