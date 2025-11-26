// Ipv4CIDRUtilities.ts
import ipaddr from 'ipaddr.js';

/**
 * Convert an IPv4 address object to a number for comparison.
 *  @param ipAddr - Ipv4 adress
 */
const ipToNumber = (ipAddr: ipaddr.IPv4): number => {
  const { octets } = ipAddr;
  return octets[0] * 256 ** 3 + octets[1] * 256 ** 2 + octets[2] * 256 + octets[3];
};

/**
 * Check if two CIDR networks overlap or are equal.
 * @param cidrNetworkA - The first CIDR network.
 * @param cidrNetworkB - The second CIDR network.
 * @returns Returns true if the CIDR networks overlap or are equal, false otherwise.
 * @throws Throws an error if either CIDR is invalid.
 */
export const hasIpv4CIDRConflict = (cidrNetworkA: string, cidrNetworkB: string): boolean => {
  if (!ipaddr.IPv4.isValidCIDR(cidrNetworkA) || !ipaddr.IPv4.isValidCIDR(cidrNetworkB)) {
    throw new Error(`Unable to parse CIDR (${cidrNetworkA} or ${cidrNetworkB})`);
  }

  const minA = ipaddr.IPv4.networkAddressFromCIDR(cidrNetworkA);
  const maxA = ipaddr.IPv4.broadcastAddressFromCIDR(cidrNetworkA);
  const minB = ipaddr.IPv4.networkAddressFromCIDR(cidrNetworkB);
  const maxB = ipaddr.IPv4.broadcastAddressFromCIDR(cidrNetworkB);

  const minANum = ipToNumber(minA);
  const maxANum = ipToNumber(maxA);
  const minBNum = ipToNumber(minB);
  const maxBNum = ipToNumber(maxB);

  return minANum <= maxBNum && maxANum >= minBNum;
};

/**
 * Normalize an IPv4 or CIDR input into a canonical CIDR form.
 * - Adds /32 if missing
 * - Normalizes host IPs to the correct network address
 * @param input - IP or CIDR string
 */
export const normalizeToCIDR = (input: string): string => {
  try {
    // Add /32 if missing
    const cidr = input.includes('/') ? input : `${input}/32`;
    const [ip, prefixStr] = cidr.split('/');
    const prefix = Number(prefixStr);

    if (!ipaddr.IPv4.isValid(ip) || Number.isNaN(prefix)) {
      throw new Error(`Invalid input: ${input}`);
    }

    const networkAddress = ipaddr.IPv4.networkAddressFromCIDR(cidr);
    return `${networkAddress.toString()}/${prefix}`;
  } catch {
    return input;
  }
};

/**
 * Check if a new IP/CIDR conflicts with any existing networks.
 * @param newNetwork - The new IP or CIDR to check.
 * @param existingNetworks - Array of existing networks (IP or CIDR).
 * @returns Returns true if there's a conflict, false otherwise.
 */
export const hasExistingIpOrCidrConflict = (
  newNetwork: string,
  existingNetworks: Array<string>,
): boolean => {
  const normalizedNew = normalizeToCIDR(newNetwork);

  return existingNetworks.some((existing) => {
    const normalizedExisting = normalizeToCIDR(existing);
    try {
      return hasIpv4CIDRConflict(normalizedNew, normalizedExisting);
    } catch {
      return false;
    }
  });
};
