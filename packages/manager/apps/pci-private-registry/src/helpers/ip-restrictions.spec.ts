import { isCidr, isIp } from './ip-restrictions';

describe('isCidr', () => {
  const testCases = [
    {
      input: '192.168.1.1/24',
      expected: true,
      description: 'Valid CIDR format',
    },
    {
      input: '255.255.255.255/32',
      expected: true,
      description: 'Max IP and CIDR range',
    },
    {
      input: '10.0.0.0/8',
      expected: true,
      description: 'Private network CIDR',
    },
    {
      input: '192.168.1.1/33',
      expected: false,
      description: 'Invalid CIDR range (too large)',
    },
    {
      input: '192.168.1.256/24',
      expected: false,
      description: 'Invalid IP address in CIDR',
    },
    { input: '192.168.1.1', expected: false, description: 'Missing CIDR part' },
    {
      input: 'invalid-string',
      expected: false,
      description: 'Completely invalid input',
    },
    { input: '', expected: false, description: 'Empty string' },
  ];

  testCases.forEach(({ input, expected, description }) => {
    it(`returns ${expected} for "${input}" (${description})`, () => {
      expect(isCidr(input)).toBe(expected);
    });
  });
});

describe('isIp', () => {
  const testCases = [
    { input: '192.168.1.1', expected: true, description: 'Valid IPv4 address' },
    {
      input: '255.255.255.255',
      expected: true,
      description: 'Broadcast IPv4 address',
    },
    { input: '0.0.0.0', expected: true, description: 'Default IPv4 address' },
    {
      input: '::1',
      expected: true,
      description: 'Valid IPv6 localhost address',
    },
    {
      input: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
      expected: true,
      description: 'Valid IPv6 address',
    },
    {
      input: '192.168.1.256',
      expected: false,
      description: 'Invalid IPv4 address (out of range)',
    },
    {
      input: 'invalid-string',
      expected: false,
      description: 'Completely invalid input',
    },
    {
      input: '192.168.1',
      expected: false,
      description: 'Incomplete IPv4 address',
    },
    {
      input: '2001:db8:85a3::8a2e:370:7334::',
      expected: false,
      description: 'Invalid IPv6 address (too many colons)',
    },
    { input: '', expected: false, description: 'Empty string' },
  ];

  testCases.forEach(({ input, expected, description }) => {
    it(`returns ${expected} for "${input}" (${description})`, () => {
      expect(isIp(input)).toBe(expected);
    });
  });
});
