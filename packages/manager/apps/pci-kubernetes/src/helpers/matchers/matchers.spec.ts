import {
  CLUSTER_NAME_CONSTRAINTS,
  NODE_POOL_NAME_CONSTRAINTS,
  getClusterUrlFragments,
  isClusterNameValid,
  isNodePoolNameValid,
} from './matchers';

const commonInvalidNames = [
  '',
  'a a',
  'aa-',
  'aa_',
  'é',
  'à',
  'è',
  '1_1',
  ' a',
  'a ',
  ' a ',
  'A',
  'a@a',
  'a#a',
  'a&a',
  'a"a',
  `a'a`,
  'a(a',
  'a§a',
  'a!a',
  'a)a',
  'a^a',
  'a¨a',
  'a*a',
  'a$a',
  'a€a',
  'a%a',
  'a£a',
  'a`a',
  'a,a',
  'a?a',
  'a;a',
  'a.a',
  'a:a',
  'a/a',
  'a=a',
  'a+a',
  'a°a',
];

const commonValidNames = ['aa', 'a1', 'a-a', 'a--a', 'name-1'];

const validMaxNodePoolName = 'a'.repeat(NODE_POOL_NAME_CONSTRAINTS.MAX_LENGTH);
const invalidMaxNodePoolName = 'a'.repeat(NODE_POOL_NAME_CONSTRAINTS.MAX_LENGTH + 1);

const validMaxClusterName = 'a'.repeat(CLUSTER_NAME_CONSTRAINTS.MAX_LENGTH);
const invalidMaxClusterName = 'a'.repeat(CLUSTER_NAME_CONSTRAINTS.MAX_LENGTH + 1);

const validNodePoolNames = ['1', '1a', '1-1', '1--1', 'a'];

const invalidNodePoolNames = ['nodePool-1', 'Aa', 'aA', 'AA', 'A1', 'a_a'];

const validClusterNames = ['Aa', 'aA', 'AA', 'A1'];

const invalidClusterNames = ['a', 'A', '1', '1a', '1-1', '1--1'];

describe(`Clusters and Node pool names should follow strict rules`, () => {
  test.each([...commonValidNames, ...validNodePoolNames])(
    'should validate node pool name: %s',
    (name) => {
      expect(isNodePoolNameValid(name)).toBe(true);
    },
  );

  it('should respect node pool name max size', () => {
    expect(isNodePoolNameValid(validMaxNodePoolName)).toBe(true);
    expect(isNodePoolNameValid(invalidMaxNodePoolName)).toBe(false);
  });

  test.each([...commonInvalidNames, ...invalidNodePoolNames])(
    'should reject node pool with name: %s',
    (name) => {
      expect(isNodePoolNameValid(name)).toBe(false);
    },
  );

  test.each([...commonValidNames, ...validClusterNames])(
    'should validate cluster name: %s',
    (name) => {
      expect(isClusterNameValid(name)).toBe(true);
    },
  );

  it('should respect cluster name max size', () => {
    expect(isClusterNameValid(validMaxClusterName)).toBe(true);
    expect(isClusterNameValid(invalidMaxClusterName)).toBe(false);
  });

  test.each([...commonInvalidNames, ...invalidClusterNames])(
    'should reject cluster with name: %s',
    (name) => {
      expect(isClusterNameValid(name)).toBe(false);
    },
  );
});

const VALID_KUBE_URLS = [
  {
    name: '1AZ EU url',
    url: '3izocz.c1.gra9.k8s.ovh.net',
    expected: { shortId: '3izocz', subRegion: 'c1', region: 'gra9' },
  },
  {
    name: '3AZ EU url',
    url: 'oie9v.b8.eu-west-eee.k8s.ovh.net',
    expected: { shortId: 'oie9v', subRegion: 'b8', region: 'eu-west-eee' },
  },
  {
    name: '1AZ US url',
    url: 'kl54.9p.vv1.k8s.ovh.us',
    expected: { shortId: 'kl54', subRegion: '9p', region: 'vv1' },
  },
  {
    name: 'any valid URL with https:// prefix',
    url: 'https://5rrr4.6y.ca1-eee.k8s.ovh.ca',
    expected: { shortId: '5rrr4', subRegion: '6y', region: 'ca1-eee' },
  },
];
const INVALID_KUBE_URLS = [
  'gra9.k8s.ovh.net',
  'c1.gra9.k8s.ovh.net',
  '3usucz..gra9.k8s.ovh.net',
  '3usucz.c1.k8s.ovh.net',
  '3us_cz.c1.gra9.k8s.ovh.net',
];

describe(`getClusterUrlFragments`, () => {
  test.each(VALID_KUBE_URLS)('should parse $name', ({ url, expected }) => {
    const match = getClusterUrlFragments(url);
    expect(match).not.toBe(null);
    expect(match!.shortId).toBe(expected.shortId);
    expect(match!.subRegion).toBe(expected.subRegion);
    expect(match!.region).toBe(expected.region);
  });

  test.each(INVALID_KUBE_URLS)('should not parse invalid kubenertes URL', (url) => {
    const match = getClusterUrlFragments(url);
    expect(match).toBe(null);
  });
});
