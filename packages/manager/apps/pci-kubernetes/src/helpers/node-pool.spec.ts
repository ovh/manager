import { describe, expect, it, vi } from 'vitest';

import { DeploymentMode, NodePoolState } from '@/types';
import { TRegionInformations } from '@/types/region';

import * as deploymentUtils from '.';
import {
  exceedsMaxNodes,
  hasInvalidScalingOrAntiAffinityConfig,
  hasMax5NodesAntiAffinity,
  isScalingValid,
  zoneAZisChecked,
} from './node-pool';

vi.mock('@/constants', () => ({
  NODE_RANGE: { MAX: 10 },
  ANTI_AFFINITY_MAX_NODES: 5,
}));

vi.mock('.', () => ({
  isMonoDeploymentZone: vi.fn(),
}));

describe('exceedsMaxNodes', () => {
  it.each([
    [11, true],
    [10, false],
    [0, false],
  ])('returns %s when quantity is %i', (input, expected) => {
    expect(exceedsMaxNodes(input)).toBe(expected);
  });
});

describe('zoneAZisChecked', () => {
  it('returns true if mono deployment zone', () => {
    vi.mocked(deploymentUtils.isMonoDeploymentZone).mockReturnValue(true);
    expect(
      zoneAZisChecked(
        { type: DeploymentMode.MONO_ZONE } as TRegionInformations,
        {} as NodePoolState,
      ),
    ).toBe(true);
  });

  it('returns true if availability zone is selected', () => {
    vi.mocked(deploymentUtils.isMonoDeploymentZone).mockReturnValue(false);
    const nodePoolState = {
      selectedAvailabilityZone: 'zone-a',
    } as NodePoolState;
    expect(
      zoneAZisChecked({ type: DeploymentMode.MULTI_ZONES } as TRegionInformations, nodePoolState),
    ).toBe(true);
  });

  it('returns false otherwise', () => {
    vi.mocked(deploymentUtils.isMonoDeploymentZone).mockReturnValue(false);
    const nodePoolState = {} as NodePoolState;
    expect(
      zoneAZisChecked({ type: DeploymentMode.MULTI_ZONES } as TRegionInformations, nodePoolState),
    ).toBe(false);
  });
});

describe('isScalingValid', () => {
  it('returns true if scaling is undefined', () => {
    expect(isScalingValid({} as NodePoolState)).toBe(true);
  });

  it.each([
    [{ isAutoscale: false, quantity: { desired: 5 } }, true],
    [{ isAutoscale: false, quantity: { desired: 11 } }, false],
    [{ isAutoscale: true, quantity: { min: 1, max: 10, desired: 5 } }, true],
    [{ isAutoscale: true, quantity: { min: 6, max: 5, desired: 5 } }, false],
    [{ isAutoscale: true, quantity: { min: 1, max: 12, desired: 5 } }, false],
    [{ isAutoscale: true, quantity: { min: 3, max: 6, desired: 2 } }, false],
  ])('returns %s for config %j', (scaling, expected) => {
    const nodePoolState = { scaling } as NodePoolState;
    expect(isScalingValid(nodePoolState)).toBe(expected);
  });
});

describe('hasMax5NodesAntiAffinity', () => {
  it.each([
    [{ antiAffinity: false }, true],
    [{ antiAffinity: true, scaling: { quantity: { desired: 4 } } }, true],
    [{ antiAffinity: true, scaling: { quantity: { desired: 5 } } }, true],
    [{ antiAffinity: true, scaling: { quantity: { desired: 6 } } }, false],
    [{ antiAffinity: true }, false],
  ])('returns %s for state %j', (state, expected) => {
    expect(hasMax5NodesAntiAffinity(state as NodePoolState)).toBe(expected);
  });
});

describe('hasInvalidScalingOrAntiAffinityConfig', () => {
  it('returns true if scaling is invalid', () => {
    const nodePoolState = {
      scaling: { isAutoscale: false, quantity: { desired: 11 } },
      antiAffinity: false,
      selectedAvailabilityZone: 'zone',
    } as NodePoolState;
    vi.mocked(deploymentUtils.isMonoDeploymentZone).mockReturnValue(false);
    const region = { type: DeploymentMode.MULTI_ZONES } as TRegionInformations;

    expect(hasInvalidScalingOrAntiAffinityConfig(region, nodePoolState)).toBe(true);
  });

  it('returns true if antiAffinity config is invalid', () => {
    const nodePoolState = {
      scaling: { isAutoscale: false, quantity: { desired: 6 } },
      antiAffinity: true,
      selectedAvailabilityZone: 'zone',
    } as NodePoolState;
    vi.mocked(deploymentUtils.isMonoDeploymentZone).mockReturnValue(false);
    const region = { type: DeploymentMode.MULTI_ZONES } as TRegionInformations;

    expect(hasInvalidScalingOrAntiAffinityConfig(region, nodePoolState)).toBe(true);
  });

  it('returns true if zone is not selected and not mono', () => {
    const nodePoolState = {
      scaling: { isAutoscale: false, quantity: { desired: 5 } },
      antiAffinity: false,
      selectedAvailabilityZone: undefined,
    } as NodePoolState;
    vi.mocked(deploymentUtils.isMonoDeploymentZone).mockReturnValue(false);
    const region = { type: DeploymentMode.MULTI_ZONES } as TRegionInformations;

    expect(hasInvalidScalingOrAntiAffinityConfig(region, nodePoolState)).toBe(true);
  });

  it('returns false if everything is valid', () => {
    const nodePoolState = {
      scaling: { isAutoscale: false, quantity: { desired: 5 } },
      antiAffinity: false,
      selectedAvailabilityZone: 'zone',
    } as NodePoolState;
    vi.mocked(deploymentUtils.isMonoDeploymentZone).mockReturnValue(false);
    const region = { type: DeploymentMode.MULTI_ZONES } as TRegionInformations;

    expect(hasInvalidScalingOrAntiAffinityConfig(region, nodePoolState)).toBe(false);
  });
});
