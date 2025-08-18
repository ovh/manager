import { Effect, Exit } from 'effect';
import { expect } from '@effect/vitest';
import {
  isGatewayCidr,
  getNetworkAddressFromCIDR,
  getAddressFromCIDR,
} from './isGatewayCidr';

it.each([
  ['', 'fail', 'Invalid IP/CIDR: '],
  ['192.168.1.0', 'fail', 'Invalid IP/CIDR: 192.168.1.0'],
  ['192.168.1.0/24', 'succeed', '192.168.1.0'],
  ['192.168.1.10/24', 'succeed', '192.168.1.0'],
  ['192.168.1.200/25', 'succeed', '192.168.1.128'],
] as const)(
  'getNetworkAddressFromCIDREffect with %s should return Effect.%s(%s)',
  (network, exitType, expected) => {
    expect(
      getNetworkAddressFromCIDR(network).pipe(Effect.runSyncExit),
    ).toStrictEqual(Exit[exitType](expected));
  },
);

it.each([
  ['', ''],
  ['192.168.1.0', '192.168.1.0'],
  ['192.168.1.0/24', '192.168.1.0'],
  ['192.168.1.10/24', '192.168.1.10'],
  ['192.168.1.200/25', '192.168.1.200'],
] as const)(
  'getNetworkAddressFromCIDREffect with %s should return (%s)',
  (network, expected) => {
    expect(getAddressFromCIDR(network)).toStrictEqual(expected);
  },
);

it.each([
  ['', 'fail', 'Invalid IP/CIDR: '],
  ['192.168.1.0', 'fail', 'Invalid IP/CIDR: 192.168.1.0'],
  ['192.168.1.0/24', 'succeed', false],
  ['192.168.1.10/24', 'succeed', true],
  ['192.168.1.128/25', 'succeed', false],
  ['192.168.1.200/25', 'succeed', true],
] as const)(
  'isGatewayCidr with %s should return Effect.%s(%s)',
  (network, exitType, expected) => {
    expect(isGatewayCidr(network).pipe(Effect.runSyncExit)).toStrictEqual(
      Exit[exitType](expected),
    );
  },
);
