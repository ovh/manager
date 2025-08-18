import ipaddr from 'ipaddr.js';
import { Effect, Equal } from 'effect';

export const getNetworkAddressFromCIDR = (cidr: string) =>
  Effect.try({
    try: () =>
      ipaddr.IPv4.networkAddressFromCIDR(cidr)
        .octets.join('.')
        .toString(),
    catch: () => `Invalid IP/CIDR: ${cidr}`,
  });

export const getAddressFromCIDR = (cidr: string) => cidr.split('/')[0];

export const not = (value: boolean) => !value;

export const isGatewayCidr = (cidr: string) =>
  getNetworkAddressFromCIDR(cidr).pipe(
    Effect.map(Equal.equals(getAddressFromCIDR(cidr))),
    Effect.map(not),
  );
