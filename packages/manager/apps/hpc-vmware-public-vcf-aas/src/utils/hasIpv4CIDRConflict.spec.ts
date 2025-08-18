import { Exit } from 'effect';
import { expect } from '@effect/vitest';
import { hasIpv4CIDRConflict } from './hasIpv4CIDRConflict';

it.each([
  [['', ''], 'fail', 'Unable to parse CIDR ( or )'],
  [['10.0.0.0/8', '192.168.1.0/24'], 'succeed', false],
  [['192.168.1.0/24', '192.168.1.0/24'], 'succeed', true],
  [['192.168.0.0/24', '192.168.1.0/24'], 'succeed', false],
  [['192.168.0.0/23', '192.168.1.0/24'], 'succeed', true],
  [['10.0.0.0/8', '10.0.0.0/24'], 'succeed', true],
  [['10.0.0.0/8', '10.1.0.0/24'], 'succeed', true],
  [['10.0.0.0/8', '11.0.0.0/24'], 'succeed', false],
  [['10.0.0.0/8', '255.255.255.255/32'], 'succeed', false],
  [['10.0.0.0/8', '10.255.255.255/32'], 'succeed', false],
  [['10.0.0.0/8', '9.255.255.255/32'], 'succeed', false],
] as const)(
  'hasIpv4CIDRConflict with %s should return Effect.%s(%s)',
  ([networkA, networkB], exitType, expected) => {
    expect(hasIpv4CIDRConflict(networkA, networkB)).toStrictEqual(
      Exit[exitType](expected),
    );
  },
);
