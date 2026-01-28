import {
  isValidIpv4Block,
  isValidIpv6Block,
  isValidDomain,
  isValidSubDomain,
  isValidReverseDomain,
  isIpMatchingSearch,
} from './validators';

describe('isValidIpv4Block', () => {
  it.each([
    { ip: '192.168.0.2/32', isValid: true },
    { ip: '192.168.0.2/33', isValid: false },
    { ip: '192.168.0.2/0', isValid: false },
    { ip: '192.168.1/20', isValid: false },
    { ip: '1924.168.1.1/19', isValid: false },
    { ip: '', isValid: false },
  ])(`$ip => $isValid`, ({ ip, isValid }) => {
    expect(isValidIpv4Block(ip)).toBe(isValid);
  });
});

describe('isValidIpv6Block', () => {
  it.each([
    { ip: '2001:67c:2e8:22::c100:68b/128', isValid: true },
    { ip: '2001:67c:2e8:22::c100/1', isValid: true },
    { ip: '2001:67c:2e8:22::c100/0', isValid: false },
    { ip: '2001:67c:2e8:22::c100/129', isValid: false },
    { ip: '', isValid: false },
  ])(`$ip => $isValid`, ({ ip, isValid }) => {
    expect(isValidIpv6Block(ip)).toBe(isValid);
  });
});

describe('isValidDomain', () => {
  it.each([
    {
      domain: 'www.test.com',
      isValid: true,
    },
    {
      domain: '*.test.com',
      isValid: false,
    },
    {
      domain: '_www.test.com',
      isValid: false,
    },
    {
      domain: '_test.com',
      isValid: true,
      canBeginWithUnderscore: true,
    },
    {
      domain: '*.test.com',
      isValid: true,
      canBeginWithWildcard: true,
    },
    {
      domain: '',
      isValid: false,
    },
    {
      domain: undefined,
      isValid: false,
    },
  ])(
    `$domain => $isValid (canBeginWithUnderscore: $canBeginWithUnderscore, canBeginWithWildcard: $canBeginWithWildcard)`,
    ({ domain, canBeginWithUnderscore, canBeginWithWildcard, isValid }) => {
      expect(
        isValidDomain(domain, { canBeginWithUnderscore, canBeginWithWildcard }),
      ).toBe(isValid);
    },
  );
});

describe('isValidSubDomain', () => {
  it.each([
    {
      domain: 'test',
      isValid: true,
    },
    {
      domain: '*.test',
      isValid: false,
    },
    {
      domain: '_test',
      isValid: false,
    },
    {
      domain: '_test',
      isValid: true,
      canBeginWithUnderscore: true,
    },
    {
      domain: '*.test',
      isValid: true,
      canBeginWithWildcard: true,
    },
    {
      domain: '',
      isValid: false,
    },
    {
      domain: undefined,
      isValid: false,
    },
  ])(
    `$domain => $isValid (canBeginWithUnderscore: $canBeginWithUnderscore, canBeginWithWildcard: $canBeginWithWildcard)`,
    ({ domain, canBeginWithUnderscore, canBeginWithWildcard, isValid }) => {
      expect(
        isValidSubDomain(domain, {
          canBeginWithUnderscore,
          canBeginWithWildcard,
        }),
      ).toBe(isValid);
    },
  );
});

describe('isValidReverseDomain', () => {
  it.each([
    {
      domain: 'www.test.com.',
      isValid: true,
    },
    {
      domain: 'www.test.com',
      isValid: false,
    },
    {
      domain: '_test.com',
      isValid: false,
      canBeginWithUnderscore: true,
    },
    {
      domain: '_test.com.',
      isValid: true,
      canBeginWithUnderscore: true,
    },
    {
      domain: '*.test.com.',
      isValid: true,
      canBeginWithWildcard: true,
    },
    {
      domain: '',
      isValid: false,
    },
    {
      domain: undefined,
      isValid: false,
    },
  ])(
    `$domain => $isValid (canBeginWithUnderscore: $canBeginWithUnderscore, canBeginWithWildcard: $canBeginWithWildcard)`,
    ({ domain, canBeginWithUnderscore, canBeginWithWildcard, isValid }) => {
      expect(
        isValidReverseDomain(domain, {
          canBeginWithUnderscore,
          canBeginWithWildcard,
        }),
      ).toBe(isValid);
    },
  );
});

describe('isIpMatchingSearch', () => {
  it.each([
    // Exact IP match
    { block: '10.0.0.6', search: '10.0.0.6', expected: true },
    { block: '10.0.0.6/32', search: '10.0.0.6', expected: true },
    // Subnet containment (IP inside CIDR block)
    { block: '10.0.0.0/27', search: '10.0.0.5', expected: true },
    { block: '10.0.0.32/27', search: '10.0.0.33', expected: true },
    // No false positives for similar IPs
    { block: '10.0.0.64', search: '10.0.0.6', expected: false },
    { block: '10.0.0.64/32', search: '10.0.0.6', expected: false },
    { block: '10.0.0.0/27', search: '10.0.0.32', expected: false },
    // Partial search (substring matching)
    { block: '10.0.0.6', search: '10.0.0', expected: true },
    { block: '10.0.0.64', search: '10.0.0', expected: true },
    { block: '10.0.0.0/27', search: '10.0.0', expected: true },
    // CIDR search (IP with mask)
    { block: '10.0.0.0/27', search: '10.0.0.5/27', expected: true },
    { block: '10.0.0.5', search: '10.0.0.5/27', expected: true },
    // IP 10.0.0.66 is inside 10.0.0.64/27 (.64-.95)
    { block: '10.0.0.64/27', search: '10.0.0.66/29', expected: true },
    { block: '10.0.0.64', search: '10.0.0.6/27', expected: false },
    // Non-matching cases
    { block: '10.0.0.6', search: '192.168.1.1', expected: false },
    { block: '10.0.0.0/27', search: '192.168.1.1', expected: false },
  ])(
    'isIpMatchingSearch($block, $search) => $expected',
    ({ block, search, expected }) => {
      expect(isIpMatchingSearch(block, search)).toBe(expected);
    },
  );
});
