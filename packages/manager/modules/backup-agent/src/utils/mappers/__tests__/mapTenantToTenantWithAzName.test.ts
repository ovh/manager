import { describe, it, expect } from 'vitest';
import {
  mapTenantToTenantWithAzName,
  mapTenantResourceToTenantResourceWithAzName,
} from '../mapTenantToTenantWithAzName';
import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import { VSPC_TENANTS_MOCKS } from '@/mocks/tenant/vspcTenants.mock';

describe('mapTenantToTenantWithAzName', () => {
  it.each([
    { tenant: TENANTS_MOCKS[0]!.currentState, expectedAzName: 'eu-west-par' },
    { tenant: TENANTS_MOCKS[1]!.currentState, expectedAzName: 'eu-west-rbx' },
    { tenant: TENANTS_MOCKS[2]!.currentState, expectedAzName: 'ap-southeast-sgp' },
    { tenant: TENANTS_MOCKS[3]!.currentState, expectedAzName: 'eu-central-waw' },
    { tenant: TENANTS_MOCKS[4]!.currentState, expectedAzName: 'ca-east-tor' },
    { tenant: TENANTS_MOCKS[5]!.currentState, expectedAzName: 'us-west-lz-pao' },
  ])(
    'should map tenant with azName "$expectedAzName"',
    ({ tenant, expectedAzName }) => {
      const result = mapTenantToTenantWithAzName(tenant);

      expect(result).toEqual({
        ...tenant,
        azName: expectedAzName,
      });
      expect(result.azName).toBe(expectedAzName);
    },
  );

  it('should return empty string for azName when vaults array is empty', () => {
    const tenantWithoutVaults = {
      ...TENANTS_MOCKS[0]!.currentState,
      vaults: [],
    };

    const result = mapTenantToTenantWithAzName(tenantWithoutVaults);

    expect(result.azName).toBe('');
  });
});

describe('mapTenantResourceToTenantResourceWithAzName', () => {
  it.each([
    { resource: TENANTS_MOCKS[0]!, expectedAzName: 'eu-west-par' },
    { resource: TENANTS_MOCKS[1]!, expectedAzName: 'eu-west-rbx' },
    { resource: TENANTS_MOCKS[2]!, expectedAzName: 'ap-southeast-sgp' },
    { resource: TENANTS_MOCKS[3]!, expectedAzName: 'eu-central-waw' },
    { resource: TENANTS_MOCKS[4]!, expectedAzName: 'ca-east-tor' },
    { resource: TENANTS_MOCKS[5]!, expectedAzName: 'us-west-lz-pao' },
  ])(
    'should map tenant resource with azName "$expectedAzName"',
    ({ resource, expectedAzName }) => {
      const result = mapTenantResourceToTenantResourceWithAzName(resource);

      expect(result.currentState.azName).toBe(expectedAzName);
      expect(result.id).toBe(resource.id);
      expect(result.resourceStatus).toBe(resource.resourceStatus);
      expect(result.currentState.name).toBe(resource.currentState.name);
    },
  );

  it.each([
    { vspcResource: VSPC_TENANTS_MOCKS[0]!, expectedAzName: 'eu-west-par' },
    { vspcResource: VSPC_TENANTS_MOCKS[1]!, expectedAzName: 'eu-west-rbx' },
    { vspcResource: VSPC_TENANTS_MOCKS[2]!, expectedAzName: 'ap-southeast-sgp' },
    { vspcResource: VSPC_TENANTS_MOCKS[3]!, expectedAzName: 'eu-central-waw' },
    { vspcResource: VSPC_TENANTS_MOCKS[4]!, expectedAzName: 'ca-east-tor' },
    { vspcResource: VSPC_TENANTS_MOCKS[5]!, expectedAzName: 'us-west-lz-pao' },
  ])(
    'should work with VSPC tenant resources and map azName "$expectedAzName"',
    ({ vspcResource, expectedAzName }) => {
      const result = mapTenantResourceToTenantResourceWithAzName(vspcResource);

      expect(result.currentState.azName).toBe(expectedAzName);
      expect(result.id).toBe(vspcResource.id);
      expect(result.resourceStatus).toBe(vspcResource.resourceStatus);
    },
  );

  it('should preserve all resource properties when mapping', () => {
    const resource = TENANTS_MOCKS[0]!;
    const result = mapTenantResourceToTenantResourceWithAzName(resource);

    expect(result.id).toBe(resource.id);
    expect(result.resourceStatus).toBe(resource.resourceStatus);
    expect(result.targetSpec).toEqual(resource.targetSpec);
    expect(result.currentTasks).toEqual(resource.currentTasks);
    expect(result.iam).toEqual(resource.iam);
    expect(result.createdAt).toBe(resource.createdAt);
    expect(result.updatedAt).toBe(resource.updatedAt);
  });
});
