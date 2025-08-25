import { Effect } from 'effect';
import { expect } from '@effect/vitest';
import { hasIpv4CIDRConflictInArray } from './hasIpv4CIDRConflictInArray';

it.each([
  [['', ['']], false],
  [['10.0.0.0/8', ['8.8.8.8/32', '192.168.1.0/24']], false],
  [['192.168.1.0/24', ['8.8.8.8/32', '192.168.1.0/24']], true],
  [['192.168.0.0/24', ['8.8.8.8/32', '192.168.1.0/24']], false],
  [['192.168.0.0/23', ['8.8.8.8/32', '192.168.1.0/24']], true],
  [['10.0.0.0/8', ['8.8.8.8/32', '10.0.0.0/24']], true],
  [['10.0.0.0/8', ['8.8.8.8/32', '10.1.0.0/24']], true],
  [['10.0.0.0/8', ['8.8.8.8/32', '11.0.0.0/24']], false],
  [['10.0.0.0/8', ['8.8.8.8/32', '255.255.255.255/32']], false],
  [['10.0.0.0/8', ['8.8.8.8/32', '10.255.255.255/32']], false],
  [['10.0.0.0/8', ['8.8.8.8/32', '9.255.255.255/32']], false],
] as const)(
  'checkCIDRConflict with %s should return %s',
  ([networkA, networkB], expected) => {
    expect(
      hasIpv4CIDRConflictInArray(networkA, networkB).pipe(
        Effect.isSuccess,
        Effect.runSync,
      ),
    ).toStrictEqual(expected);
  },
);
