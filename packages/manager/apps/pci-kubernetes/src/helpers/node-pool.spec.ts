import { describe, it, expect } from 'vitest';
import * as nodePool from './node-pool';
import { DeploymentMode, NodePoolState } from '@/types';
import { ANTI_AFFINITY_MAX_NODES, NODE_RANGE } from '@/constants';
import { TRegionInformations } from '@/types/region';

const makeMockRegionInformations = (
  overrides: Partial<TRegionInformations>,
): TRegionInformations =>
  ({
    type: DeploymentMode.MONO_ZONE,
    availabilityZones: ['zone1', 'zone2'],
    continentCode: 'EU',
    countryCode: 'fr',
    datacenterLocation: 'Frankfurt',
    ipCountries: [],
    name: 'Frankfurt 1',

    status: 'UP',
    ...overrides,
  } as TRegionInformations);

const makeMockNodePoolState = (overrides: Partial<NodePoolState> = {}) =>
  ({
    name: 'test-nodepool',
    isTouched: false,
    selectedAvailabilityZone: '',
    scaling: {
      isAutoscale: false,
      quantity: {
        desired: 3,
        min: 1,
        max: 5,
      },
    },
    antiAffinity: false,
    ...overrides,
  } as NodePoolState);

describe('node-pool module', () => {
  it('exceedsMaxNodes should return correct results', () => {
    [
      { input: NODE_RANGE.MAX + 1, expected: true },
      { input: NODE_RANGE.MAX, expected: false },
      { input: 0, expected: false },
    ].forEach(({ input, expected }) => {
      expect(nodePool.exceedsMaxNodes(input)).toBe(expected);
    });
  });

  it('zoneAZisChecked should validate AZ correctly', () => {
    const regionMono = makeMockRegionInformations({
      type: DeploymentMode.MONO_ZONE,
    });
    const regionMulti = makeMockRegionInformations({
      type: DeploymentMode.MULTI_ZONES,
    });

    [
      {
        description: 'mono-deployment',
        region: regionMono,
        state: makeMockNodePoolState({ selectedAvailabilityZone: undefined }),
        expected: true,
      },
      {
        description: 'mono-deployment AZ',
        region: regionMono,
        state: makeMockNodePoolState({ selectedAvailabilityZone: 'zone1' }),
        expected: true,
      },
      {
        description: 'multi-deployment AZ',
        region: regionMulti,
        state: makeMockNodePoolState({ selectedAvailabilityZone: 'zone111' }),
        expected: true,
      },
      {
        description: 'multi-deployment with no AZ',
        region: regionMulti,
        state: makeMockNodePoolState({ selectedAvailabilityZone: undefined }),
        expected: false,
      },
    ].forEach(({ region, state, expected }) => {
      expect(nodePool.zoneAZisChecked(region, state)).toBe(expected);
    });
  });

  it('isScalingValid should correctly validate scaling', () => {
    [
      {
        description: 'valid fixed scaling',
        state: makeMockNodePoolState(),
        expected: true,
      },
      {
        description: 'desired > max',
        state: makeMockNodePoolState({
          scaling: {
            isAutoscale: false,
            quantity: { desired: NODE_RANGE.MAX + 1, min: 1, max: 5 },
          },
        }),
        expected: false,
      },
      {
        description: 'autoscale with min < 0',
        state: makeMockNodePoolState({
          scaling: {
            isAutoscale: true,
            quantity: { desired: 3, min: -1, max: 5 },
          },
        }),
        expected: false,
      },
      {
        description: 'autoscale with max < desired',
        state: makeMockNodePoolState({
          scaling: {
            isAutoscale: true,
            quantity: { desired: 6, min: 1, max: 5 },
          },
        }),
        expected: false,
      },
      {
        description: 'valid autoscale',
        state: makeMockNodePoolState({
          scaling: {
            isAutoscale: true,
            quantity: { desired: 3, min: 1, max: NODE_RANGE.MAX },
          },
        }),
        expected: true,
      },
    ].forEach(({ state, expected }) => {
      expect(nodePool.isScalingValid(state)).toBe(expected);
    });
  });

  it('hasMax5NodesAntiAffinity should validate anti-affinity limit', () => {
    [
      {
        description: 'antiAffinity disabled',
        state: makeMockNodePoolState({ antiAffinity: false }),
        expected: true,
      },
      {
        description: 'antiAffinity enabled, under limit',
        state: makeMockNodePoolState({
          antiAffinity: true,
          scaling: {
            isAutoscale: false,
            quantity: { desired: 5, min: 1, max: 5 },
          },
        }),
        expected: true,
      },
      {
        description: 'antiAffinity enabled, over limit',
        state: makeMockNodePoolState({
          antiAffinity: true,
          scaling: {
            isAutoscale: false,
            quantity: { desired: ANTI_AFFINITY_MAX_NODES + 1, min: 1, max: 10 },
          },
        }),
        expected: false,
      },
    ].forEach(({ state, expected }) => {
      expect(nodePool.hasMax5NodesAntiAffinity(state)).toBe(expected);
    });
  });

  it('errorWithScalingOrAntiAffinity should return true if any check fails', () => {
    const regionMono = makeMockRegionInformations({
      type: DeploymentMode.MONO_ZONE,
    });
    const regionMulti = makeMockRegionInformations({
      type: DeploymentMode.MULTI_ZONES,
    });

    [
      {
        description: 'all valid',
        region: regionMono,
        state: makeMockNodePoolState(),
        expected: false,
      },
      {
        description: 'invalid scaling',
        region: regionMono,
        state: makeMockNodePoolState({
          scaling: {
            isAutoscale: false,
            quantity: { desired: NODE_RANGE.MAX + 1, min: 1, max: 5 },
          },
        }),
        expected: true,
      },
      {
        description: 'antiAffinity over limit',
        region: regionMono,
        state: makeMockNodePoolState({
          antiAffinity: true,
          scaling: {
            isAutoscale: false,
            quantity: { desired: ANTI_AFFINITY_MAX_NODES + 1, min: 1, max: 10 },
          },
        }),
        expected: true,
      },
      {
        description: 'missing AZ in multi-deployment',
        region: regionMulti,
        state: makeMockNodePoolState({ selectedAvailabilityZone: '' }),
        expected: true,
      },
    ].forEach(({ region, state, expected }) => {
      expect(
        nodePool.hasInvalidScalingOrAntiAffinityConfig(region, state),
      ).toBe(expected);
    });
  });
});
