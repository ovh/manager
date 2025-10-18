import {
  convertToCIDR,
  hasExistingIpOrCidrConflict,
} from './Ipv4CIDRUtilities';

describe('convertToCIDR', () => {
  it.each([
    ['192.168.1.1', '192.168.1.1/32'],
    ['10.0.0.1', '10.0.0.1/32'],
    ['192.168.1.0/24', '192.168.1.0/24'],
    ['10.0.0.0/8', '10.0.0.0/8'],
    ['172.16.0.0/16', '172.16.0.0/16'],
    ['255.255.255.255', '255.255.255.255/32'],
    ['0.0.0.0', '0.0.0.0/32'],
    ['192.168.1.1/32', '192.168.1.1/32'],
  ])('convertToCIDR(%s) should return %s', (input, expected) => {
    expect(convertToCIDR(input)).toBe(expected);
  });
});

describe('hasExistingIpOrCidrConflict', () => {
  it.each([
    ['192.168.1.1', ['192.168.1.1'], true],
    ['192.168.1.50', ['192.168.1.0/24'], true],
    ['192.168.1.1', ['192.168.2.0/24'], false],
    ['192.168.1.0/24', ['192.168.0.0/23'], true],
    ['192.168.1.0/24', ['192.168.2.0/24'], false],
    ['192.168.1.50', ['10.0.0.0/8', '192.168.1.0/24', '172.16.0.0/16'], true],
    ['192.168.5.1', ['10.0.0.0/8', '192.168.1.0/24', '172.16.0.0/16'], false],
    ['192.168.1.1', [], false],
    ['10.0.0.0/8', ['10.0.0.1'], true],
    ['192.168.1.0/24', ['192.168.1.0/24'], true],
    ['192.168.1.1/32', ['192.168.1.1/32'], true],
    ['192.168.1.0/24', ['192.168.0.0/24', '192.168.2.0/24'], false],
  ])(
    'hasExistingIpOrCidrConflict(%s, %s) should return %s',
    (newNetwork, existingNetworks, expected) => {
      expect(hasExistingIpOrCidrConflict(newNetwork, existingNetworks)).toBe(
        expected,
      );
    },
  );
});
