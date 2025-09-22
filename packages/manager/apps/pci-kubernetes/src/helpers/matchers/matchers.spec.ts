import {
  CLUSTER_NAME_CONSTRAINTS,
  NODE_POOL_NAME_CONSTRAINTS,
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
