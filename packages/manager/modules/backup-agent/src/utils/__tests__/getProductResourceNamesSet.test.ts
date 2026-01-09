import { VSPC_TENANTS_MOCKS } from '@/mocks/tenant/vspcTenants.mock';
import { Resource } from '@/types/Resource.type';
import { VSPCTenant } from '@/types/VspcTenant.type';
import { getProductResourceNames } from '@/utils/getProductResourceNamesSet';

describe('getProductResourceNames', () => {
  it.each([
    {
      description: 'should return an empty set if no tenants are provided',
      input: [] as Resource<VSPCTenant>[],
      expected: new Set(),
    },
    {
      description: 'should return product names from mock tenants',
      input: VSPC_TENANTS_MOCKS,
      expected: new Set(['my-resource-name']),
    },
  ])('$description', ({ input, expected }) => {
    const result = getProductResourceNames(input);
    expect(result).toEqual(expected);
  });
});
