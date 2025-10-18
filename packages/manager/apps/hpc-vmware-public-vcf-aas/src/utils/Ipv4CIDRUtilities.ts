// Ipv4CIDRUtilities.ts
import ipaddr from 'ipaddr.js';

/**
 * Convert an IPv4 address object to a number for comparison.
 *  @param ipAddr - Ipv4 adress
 */
const ipToNumber = (ipAddr: ipaddr.IPv4): number => {
  const { octets } = ipAddr;
  return (
    octets[0] * 256 ** 3 + octets[1] * 256 ** 2 + octets[2] * 256 + octets[3]
  );
};

/**
 * Check if two CIDR networks overlap or are equal.
 * @param cidrNetworkA - The first CIDR network.
 * @param cidrNetworkB - The second CIDR network.
 * @returns Returns true if the CIDR networks overlap or are equal, false otherwise.
 * @throws Throws an error if either CIDR is invalid.
 */
export const hasIpv4CIDRConflict = (
  cidrNetworkA: string,
  cidrNetworkB: string,
): boolean => {
  if (
    !ipaddr.IPv4.isValidCIDR(cidrNetworkA) ||
    !ipaddr.IPv4.isValidCIDR(cidrNetworkB)
  ) {
    throw new Error(
      `Unable to parse CIDR (${cidrNetworkA} or ${cidrNetworkB})`,
    );
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
 * Convert single IP to /32 CIDR. If already in CIDR, return as-is.
 * @param input - IP or CIDR.
 */
export const convertToCIDR = (input: string): string => {
  if (input.includes('/')) {
    return input;
  }
  return `${input}/32`;
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
  const normalizedNew = convertToCIDR(newNetwork);

  return existingNetworks.some((existing) => {
    const normalizedExisting = convertToCIDR(existing);
    try {
      return hasIpv4CIDRConflict(normalizedNew, normalizedExisting);
    } catch {
      return false;
    }
  });
};
