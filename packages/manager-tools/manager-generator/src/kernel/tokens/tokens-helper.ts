/**
 * @file tokens-helper.ts
 * @description Low-level helpers for token resolution and replacement.
 */
import { type TokenMap, TokenMod } from '../types/tokens-types';

/**
 * Safe `hasOwnProperty` check.
 * @param obj - Object to test.
 * @param key - Property key.
 * @returns True if `key` is an own property of `obj`.
 */
export function safeHas(obj: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Matches `{{ token }}` with optional inline modifier via `|mod`.
 * Allowed token characters: letters, digits, `_`, `-`, `|`.
 * @example
 * "{{APP_NAME}}", "{{ appName | json }}"
 */
export const TOKEN_RE: RegExp = /{{\s*([A-Za-z0-9_-|]+)\s*}}/g;

/**
 * Matches a quoted token: `'{{ token }}'` or `"{{ token }}"` (with optional `|mod`).
 * Capturing groups:
 *  1. The quote char (`'` or `"`)
 *  2. The raw token with optional `|mod`
 */
export const TOKEN_IN_QUOTES_RE: RegExp = /(['"])\s*{{\s*([A-Za-z0-9_-|]+)\s*}}\s*\1/g;

/**
 * Parse a raw token like `"name|mod"` into components.
 * @param raw - Raw token content without outer `{{ }}` (e.g., `"NAME|json"`).
 * @returns Parsed `{ name, mod }`.
 */
export function parseTokenAndMod(raw: string): { name: string; mod?: TokenMod } {
  const [name, mod] = raw.split('|', 2).map((s) => s.trim());
  return { name: name || '', mod: (mod as TokenMod | undefined) || undefined };
}

/**
 * Tolerant token lookup:
 *  1. exact key
 *  2. UPPER_SNAKE_CASE form
 *  3. lowerCamel (first letter lowered)
 *
 * @param tokens - Token dictionary.
 * @param name - Token name to resolve.
 * @returns Resolved value or `undefined`.
 */
export function lookup(tokens: TokenMap, name: string): unknown {
  if (!name) return undefined;
  if (safeHas(tokens, name)) return tokens[name];
  const upper = name.toUpperCase();
  if (safeHas(tokens, upper)) return tokens[upper];
  const lowerName = name.charAt(0).toLowerCase() + name.slice(1);
  if (safeHas(tokens, lowerName)) return tokens[lowerName];
  return undefined;
}

/** Precompiled regex cache for quote escaping. */
const QUOTE_ESCAPERS: Record<"'" | '"', RegExp> = {
  "'": /'/g,
  '"': /"/g,
};

/**
 * Stringify a value for safe insertion into text.
 * - strings: optionally escape the specified quote char
 * - numbers/booleans: `String(value)`
 * - objects/arrays: `JSON.stringify(value)`
 * - `null`/`undefined`: empty string
 *
 * @param value - Value to stringify.
 * @param quote - If provided, escape this quote char within strings.
 * @returns String representation suitable for template insertion.
 */
export function safeToString(value: unknown, quote?: '"' | "'"): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') {
    if (!quote) return value;
    return value.replace(QUOTE_ESCAPERS[quote], `\\${quote}`);
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return JSON.stringify(value);
}

/**
 * Apply an inline token modifier.
 * - `json`: JSON-encode the value
 * - `bool`: Convert to `true`/`false` via `Boolean(val)`
 * - `raw` : Return primitives as-is; non-primitives as JSON
 * - `undefined` (no mod): fallback to {@link safeToString}
 *
 * @param val - Value to transform.
 * @param mod - Modifier to apply.
 * @returns Transformed string.
 */
export function applyMod(val: unknown, mod?: TokenMod): string {
  if (!mod) return safeToString(val);
  if (mod === 'json') return JSON.stringify(val);
  if (mod === 'bool') return String(Boolean(val));
  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
    return String(val);
  }
  return JSON.stringify(val);
}

/**
 * Replace all token occurrences in `content` using `tokens`.
 *
 * ### Quoted tokens: `'{{x}}'` or `"{{x}}"`
 * - booleans/numbers → **unquoted** literals
 * - strings → re-quoted with proper escaping
 * - objects/arrays → JSON literal (unquoted)
 * - `|json` → raw JSON (strings included)
 * - `|raw` → unquoted insertion (be careful)
 *
 * ### Unquoted tokens
 * - default → {@link safeToString}
 * - `|json` → JSON
 * - `|bool` → `"true"` / `"false"`
 * - `|raw`  → primitives as-is; else JSON
 *
 * Missing tokens are left as-is.
 *
 * @param content - Input text containing tokens.
 * @param tokens - Token dictionary.
 * @returns Text with replacements applied.
 */
export function replaceTokens(content: string, tokens: TokenMap): string {
  // 1) Replace quoted tokens first so we can re-quote correctly
  content = content.replace(
    TOKEN_IN_QUOTES_RE,
    (match: string, quote: string, raw: string): string => {
      const { name, mod } = parseTokenAndMod(raw);
      const value = lookup(tokens, name);
      if (value === undefined) return match; // leave untouched

      if (mod === 'json') return JSON.stringify(value);

      // numbers/booleans → unquoted
      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
      }

      if (mod === 'raw') {
        return applyMod(value, 'raw');
      }

      // strings → re-quote & escape; objects → JSON literal
      if (typeof value === 'string') {
        const q = quote as '"' | "'";
        return `${q}${safeToString(value, q)}${q}`;
      }
      return JSON.stringify(value);
    },
  );

  // 2) Then replace unquoted tokens
  return content.replace(TOKEN_RE, (match: string, raw: string): string => {
    const { name, mod } = parseTokenAndMod(raw);
    const value = lookup(tokens, name);
    if (value === undefined) return match;
    return applyMod(value, mod);
  });
}

/**
 * Throw if any `{{token}}` remains in `content` (for non–dry runs).
 * @param filePath - File path used in the error message.
 * @param content - File content to check.
 * @throws If unresolved tokens are found.
 */
export function assertNoUnresolvedTokens(filePath: string, content: string): void {
  const leftovers = content.match(TOKEN_RE);
  if (leftovers && leftovers.length) {
    const unique = Array.from(new Set(leftovers));
    throw new Error(`Unresolved tokens in ${filePath}: ${unique.join(', ')}`);
  }
}

/**
 * Strip a `v2-/` or `v6-/` (or `v6Iceberg-/`) prefix if present,
 * then normalize to a single leading slash.
 *
 * @example
 * stripApiVersionPrefix("v6-/ovhCloudConnect") // "/ovhCloudConnect"
 * stripApiVersionPrefix("/ovhCloudConnect")    // "/ovhCloudConnect"
 *
 * @param p - Versioned path.
 * @returns Path without the version prefix.
 */
export function stripApiVersionPrefix(p?: string): string {
  const s = (p ?? '').trim();
  if (!s) return '';
  // Match v2-/, v6-/, v6Iceberg-/
  return s.replace(/^v(?:2|6)(?:Iceberg)?-\//, '/');
}

/**
 * From values like `"/ovhCloudConnect/{serviceName}-getOvhCloudConnectServiceName"`,
 * keep only the path part:
 *  - If a `-` delimiter occurs **outside** braces, and the suffix after `-` contains **no** `/`,
 *    treat it as a method suffix and strip it.
 *  - If the suffix after `-` contains `/`, treat the whole input as a path and keep it.
 *
 * @param value - Combined endpoint string.
 * @returns The path portion, normalized with a leading slash.
 */
export function splitCombinedEndpoint(value?: string): string {
  const s = (value ?? '').trim();
  if (!s) return '';

  let brace = 0;
  let cut = -1;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '{') brace++;
    else if (ch === '}') brace = Math.max(0, brace - 1);
    else if (ch === '-' && brace === 0) {
      // treat "-getSomething" / "-listAll" as a method suffix (no "/" after)
      const rest = s.slice(i + 1);
      if (!rest.includes('/')) {
        cut = i;
        break;
      }
    }
  }

  const pathPart = cut > 0 ? s.slice(0, cut) : s;
  return normalizeApiPath(pathPart);
}

/**
 * Sanitize a schema path:
 *  - Ensure a leading slash
 *  - Drop `{}` braces from parameters (schema uses plain segment names)
 *
 * @example
 * sanitizePathForSchema("/cloud/project/{serviceName}") // "/cloud/project/serviceName"
 *
 * @param rawPath - Input path.
 * @returns Sanitized path.
 */
export function sanitizePathForSchema(rawPath?: string): string {
  const withSlash = normalizeApiPath(rawPath ?? '');
  return withSlash.replace(/\{([^}]+)\}/g, '$1');
}

/**
 * Normalize a base path by stripping any `v2-/`, `v6-/`, or `v6Iceberg-/` prefix.
 * Does **not** auto-add a leading slash here.
 *
 * @param v - Unknown value possibly containing a path.
 * @returns Normalized (potentially empty) string.
 */
export const normalizeBasePath = (v: unknown): string => {
  const raw = typeof v === 'string' ? v.trim() : '';
  return stripApiVersionPrefix(raw); // version removed; caller decides on leading slash
};

/**
 * Normalize a combined endpoint:
 *  1) Keep only the path part (brace-aware suffix split)
 *  2) Drop `{}` braces for schema matching
 *  3) Ensure a leading slash
 *
 * @param v - Unknown value possibly containing a combined endpoint.
 * @returns Sanitized path (e.g., `"/cloud/project/serviceName"`).
 */
export const normalizeCombined = (v: unknown): string => {
  const raw = typeof v === 'string' ? v : '';
  const onlyPath = splitCombinedEndpoint(raw); // keeps braces for now
  return sanitizePathForSchema(onlyPath); // drop braces + ensure leading slash
};

/**
 * Convert a string into kebab-case.
 *
 * Replaces:
 * - camelCase → kebab-case
 * - underscores/spaces → hyphens
 * - non-alphanumeric characters → hyphens
 * - multiple consecutive hyphens → single hyphen
 * - leading/trailing hyphens → trimmed
 *
 * @param s - Input string
 * @returns The kebab-cased version of the input
 *
 * @example
 * ```ts
 * toKebabCase("MyAppName"); // "my-app-name"
 * toKebabCase("app_pci_test"); // "app-pci-test"
 * ```
 */
export function toKebabCase(s: string): string {
  return (s || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/**
 * Legacy PCI slug normalization.
 *
 * Removes legacy `app-pci-` or `pci-` prefixes to extract the raw slug.
 *
 * @param slug - Slug string to normalize
 * @returns Normalized slug without PCI prefixes
 *
 * @example
 * ```ts
 * shortPciSlug("app-pci-billing"); // "billing"
 * shortPciSlug("pci-project");     // "project"
 * ```
 */
export function shortPciSlug(slug: string): string {
  return slug.replace(/^app-pci-/, '').replace(/^pci-/, '');
}

/**
 * Normalize a path to always start with '/'.
 * If the value is an absolute URL, only the pathname is preserved.
 * If the input is falsy, defaults to `/services`.
 *
 * @param p - Path string or URL
 * @returns Normalized pathname starting with '/'
 *
 * @example
 * ```ts
 * normalizeApiPath("cloud");              // "/cloud"
 * normalizeApiPath("https://api.com/v6"); // "/v6"
 * normalizeApiPath("");                   // "/services"
 * ```
 */
export function normalizeApiPath(p: string): string {
  const t = (p || '').trim();
  if (!t) return '/services';
  try {
    const u = new URL(t);
    return u.pathname || '/';
  } catch {
    // not absolute
  }
  return t.startsWith('/') ? t : `/${t}`;
}
