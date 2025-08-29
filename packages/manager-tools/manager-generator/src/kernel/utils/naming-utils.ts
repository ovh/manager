/**
 * Ensure a string ends with a given suffix exactly once.
 *
 * @param s Input string
 * @param suffix Required suffix to append if missing
 * @returns The string guaranteed to end with the suffix
 *
 * @example
 * ensureSuffix("demo", "-app") // "demo-app"
 */
export function ensureSuffix(s: string, suffix: string): string {
  return s.endsWith(suffix) ? s : `${s}${suffix}`;
}

/**
 * Derive a final package name for an application.
 *
 * Rules:
 * - Use the provided `packageName` if non-empty.
 * - Otherwise normalize `appName`:
 *   - Keep only `[a-z0-9-]`
 *   - Lowercase everything
 *   - Ensure a single `-app` suffix
 *   - Prefix with `@ovh-ux/manager-`
 *
 * @param appName Application name (free-form input)
 * @param packageName Optional explicit package name
 * @returns A scoped, normalized package name
 *
 * @example
 * derivePkgName("pci-demo")        // "@ovh-ux/manager-pci-demo-app"
 * derivePkgName("web")             // "@ovh-ux/manager-web-app"
 * derivePkgName("zimbra-ui", "z")  // "z"
 */
export function derivePkgName(appName: string, packageName?: string): string {
  console.log({
    appName,
    packageName,
  });
  if (packageName && packageName.trim()) return packageName.trim();
  const norm = appName.replace(/[^a-z0-9-]/gi, '').toLowerCase();
  const withApp = ensureSuffix(norm, '-app');

  console.log({
    norm,
    withApp,
    full: `@ovh-ux/manager-${withApp}`,
  });
  return `@ovh-ux/manager-${withApp}`;
}

/**
 * Type guard: check if a value is a `{ name, value }` pair.
 *
 * @param x Unknown value
 * @returns True if `x` is an object with `name` and `value`
 */
export function isNameValue(x: unknown): x is { name: string; value: string } {
  return !!x && typeof x === 'object' && 'name' in x && 'value' in x;
}

/**
 * Type guard: check if a value is a "separator-like" choice
 * produced by `getApiPaths`.
 *
 * @param x Unknown value
 * @returns True if `x` has `{ type: 'separator' }`
 */
export function isSeparatorLike(x: unknown): x is { type: 'separator'; line?: string } {
  return (
    !!x && typeof x === 'object' && 'type' in x && (x as { type: unknown }).type === 'separator'
  );
}
