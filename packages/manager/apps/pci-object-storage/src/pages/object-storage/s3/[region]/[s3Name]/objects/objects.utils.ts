/**
 * Utility functions for the Objects page
 */

/**
 * Normalizes a prefix by removing trailing slashes
 * @param prefix - The prefix to normalize
 * @returns The normalized prefix without trailing slash
 */
export function normalizePrefix(prefix: string): string {
  return prefix.replace(/\/$/, '');
}

/**
 * Builds the URL for the add-object route with optional prefix query parameter
 * @param prefix - The prefix to include in the URL (will be normalized)
 * @returns The relative URL path with query string
 */
export function buildAddObjectUrl(prefix: string): string {
  const normalizedPrefix = normalizePrefix(prefix);
  if (!normalizedPrefix) {
    return './add-object';
  }
  return `./add-object?prefix=${encodeURIComponent(normalizedPrefix)}`;
}

/**
 * Gets the effective prefix for API calls
 * Search query takes precedence over navigation prefix
 * @param searchQuery - The current search query
 * @param navigationPrefix - The current navigation prefix
 * @returns The effective prefix to use
 */
export function getEffectivePrefix(
  searchQuery: string,
  navigationPrefix: string,
): string {
  return searchQuery || navigationPrefix;
}
