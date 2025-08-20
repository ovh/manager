import { buildAppWorkspacePath, getPackageNameFromApp } from './workspace-utils.js';

/**
 * Internal helper: derive the best Turbo filter value for a given `appRef`.
 *
 * - Prefers the package name (`@scope/name`) if available.
 * - Falls back to the last path segment of the canonical workspace path.
 *
 * @param appRef - Application reference (name, package name, or path).
 * @returns The filter string for Turbo, or `null` if unresolved.
 */
export function resolveBuildFilter(appRef?: string): string | null {
  if (!appRef) return null;

  const pkg = getPackageNameFromApp(appRef);
  if (pkg) return pkg; // Prefer the package name (@scope/name)

  // Fallback: last segment of the canonical workspace path
  const rel = buildAppWorkspacePath(appRef); // packages/manager/apps/<name>
  const parts = rel.split('/');
  return parts[parts.length - 1] || null;
}
