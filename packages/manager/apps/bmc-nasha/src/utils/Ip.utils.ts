/**
 * IP utilities for NAS-HA application
 * Migrated from AngularJS nasha.utils.js
 */

/**
 * Convert IP block to number for sorting
 *
 * Example: "192.168.1.0/24" → 192168001024
 *
 * This ensures IP blocks are sorted numerically instead of alphabetically
 * Equivalent to ipBlockToNumber in AngularJS nasha.utils.js
 *
 * @param ipBlock - IP address or IP block (e.g., "192.168.1.0/24")
 * @returns Numeric representation for sorting
 */
export function ipBlockToNumber(ipBlock: string): number {
  return Number(
    ipBlock
      .replace('/', '.')
      .split('.')
      .map((n) => n.padStart(3, '0'))
      .join(''),
  );
}

/**
 * Sort function for IP addresses and IP blocks
 *
 * Usage: ipAddresses.sort(sortByIpBlock)
 *
 * @param a - First IP block
 * @param b - Second IP block
 * @returns Sort order (-1, 0, or 1)
 */
export function sortByIpBlock(a: string, b: string): number {
  return ipBlockToNumber(a) - ipBlockToNumber(b);
}
