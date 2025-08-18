import { Effect } from 'effect/index';
import ipaddr from 'ipaddr.js';

/**
 * Check if two CIDR networks overlap or are equal.
 * @param {string} cidrNetworkA - The first CIDR network.
 * @param {string} cidrNetworkB - The second CIDR network.
 * @returns {boolean} - Returns Effect succeed(true) if the CIDR networks overlap or are equal, Effect succeed false otherwise.
 */
export const hasIpv4CIDRConflict = (
  cidrNetworkA: string,
  cidrNetworkB: string,
) => {
  if (
    !ipaddr.IPv4.isValidCIDR(cidrNetworkA) ||
    !ipaddr.IPv4.isValidCIDR(cidrNetworkB)
  ) {
    return Effect.fail(
      `Unable to parse CIDR (${cidrNetworkA} or ${cidrNetworkB})`,
    );
  }

  const minA = ipaddr.IPv4.networkAddressFromCIDR(cidrNetworkA);
  const maxA = ipaddr.IPv4.broadcastAddressFromCIDR(cidrNetworkA);
  const minB = ipaddr.IPv4.networkAddressFromCIDR(cidrNetworkB);
  const maxB = ipaddr.IPv4.broadcastAddressFromCIDR(cidrNetworkB);

  if (minA < maxB && minB < maxA) {
    return Effect.succeed(true);
  }

  if (minA === minB && maxA === maxB) {
    return Effect.succeed(true);
  }

  return Effect.succeed(false);
};
