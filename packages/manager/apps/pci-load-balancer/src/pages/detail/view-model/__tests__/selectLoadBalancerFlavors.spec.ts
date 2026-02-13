import { describe, expect, it } from 'vitest';

import { TLoadBalancerFlavorWithPricing } from '@/domain/entities/loadBalancerFlavor';

import { selectLoadBalancerFlavors } from '../selectLoadBalancerFlavors';

const createFlavor = (
  id: string,
  name: string,
  pricing: TLoadBalancerFlavorWithPricing['pricing'],
): TLoadBalancerFlavorWithPricing =>
  ({ id, name, region: 'BHS5', pricing }) as TLoadBalancerFlavorWithPricing;

describe('selectLoadBalancerFlavors', () => {
  it('returns empty array when given empty array', () => {
    expect(selectLoadBalancerFlavors([])).toEqual([]);
  });

  it.each([
    {
      description: 'uses priceInUcents when only hour pricing',
      flavor: createFlavor('f1', 'small', [{ priceInUcents: 100, type: 'hour' }]),
      expected: { id: 'f1', name: 'small', priceInUcents: 100 },
    },
    {
      description: 'uses priceInUcents when only none pricing',
      flavor: createFlavor('f2', 'medium', [{ priceInUcents: 0, type: 'none' }]),
      expected: { id: 'f2', name: 'medium', priceInUcents: 0 },
    },
    {
      description: 'prefers hour over none when both exist',
      flavor: createFlavor('f3', 'large', [
        { priceInUcents: 50, type: 'none' },
        { priceInUcents: 200, type: 'hour' },
      ]),
      expected: { id: 'f3', name: 'large', priceInUcents: 200 },
    },
    {
      description: 'uses hour when hour and month exist',
      flavor: createFlavor('f4', 'xl', [
        { priceInUcents: 5000, type: 'month' },
        { priceInUcents: 300, type: 'hour' },
      ]),
      expected: { id: 'f4', name: 'xl', priceInUcents: 300 },
    },
    {
      description: 'returns null priceInUcents when no hour or none pricing',
      flavor: createFlavor('f5', '2xl', [{ priceInUcents: 10000, type: 'month' }]),
      expected: { id: 'f5', name: '2xl', priceInUcents: null },
    },
    {
      description: 'returns null priceInUcents when pricing array is empty',
      flavor: createFlavor('f6', 'small', []),
      expected: { id: 'f6', name: 'small', priceInUcents: null },
    },
  ])('$description', ({ flavor, expected }) => {
    expect(selectLoadBalancerFlavors([flavor])).toEqual([
      { id: expected.id, size: expected.name, priceInUcents: expected.priceInUcents },
    ]);
  });

  it('maps multiple flavors to options with id, size and priceInUcents sorted by SIZE_ORDER', () => {
    const flavors: TLoadBalancerFlavorWithPricing[] = [
      createFlavor('id-1', 'small', [{ priceInUcents: 100, type: 'hour' }]),
      createFlavor('id-2', 'large', [{ priceInUcents: 0, type: 'none' }]),
      createFlavor('id-3', 'xl', []),
    ];
    // SIZE_ORDER is ['small', 'medium', 'large', 'xl'] → small(0), large(2), xl(3)
    expect(selectLoadBalancerFlavors(flavors)).toEqual([
      { id: 'id-1', size: 'small', priceInUcents: 100 },
      { id: 'id-2', size: 'large', priceInUcents: 0 },
      { id: 'id-3', size: 'xl', priceInUcents: null },
    ]);
  });

  it('sorts flavors by SIZE_ORDER (small, medium, large, xl, 2xl)', () => {
    const flavors: TLoadBalancerFlavorWithPricing[] = [
      createFlavor('id-xl', 'xl', [{ priceInUcents: 400, type: 'hour' }]),
      createFlavor('id-small', 'small', [{ priceInUcents: 100, type: 'hour' }]),
      createFlavor('id-large', 'large', [{ priceInUcents: 300, type: 'hour' }]),
      createFlavor('id-medium', 'medium', [{ priceInUcents: 200, type: 'hour' }]),
      createFlavor('id-2xl', '2xl', [{ priceInUcents: 500, type: 'hour' }]),
    ];
    expect(selectLoadBalancerFlavors(flavors)).toEqual([
      { id: 'id-small', size: 'small', priceInUcents: 100 },
      { id: 'id-medium', size: 'medium', priceInUcents: 200 },
      { id: 'id-large', size: 'large', priceInUcents: 300 },
      { id: 'id-xl', size: 'xl', priceInUcents: 400 },
      { id: 'id-2xl', size: '2xl', priceInUcents: 500 },
    ]);
  });
});
