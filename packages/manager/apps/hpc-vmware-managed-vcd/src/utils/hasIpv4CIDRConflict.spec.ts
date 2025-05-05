import { hasIpv4CIDRConflict } from './hasIpv4CIDRConflict';

it.each([
  [['', ''], true],
  [['10.0.0.0/8', '192.168.1.0/24'], false],
  [['192.168.1.0/24', '192.168.1.0/24'], true],
  [['192.168.0.0/24', '192.168.1.0/24'], false],
  [['192.168.0.0/23', '192.168.1.0/24'], true],
  [['10.0.0.0/8', '10.0.0.0/24'], true],
  [['10.0.0.0/8', '10.1.0.0/24'], true],
  [['10.0.0.0/8', '11.0.0.0/24'], false],
  [['10.0.0.0/8', '255.255.255.255/32'], false],
  [['10.0.0.0/8', '10.255.255.255/32'], false],
  [['10.0.0.0/8', '9.255.255.255/32'], false],
])(
  'hasIpv4CIDRConflict with %s should return %s',
  ([networkA, networkB], expected) => {
    expect(hasIpv4CIDRConflict(networkA, networkB)).toBe(expected);
  },
);
