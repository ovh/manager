import { render } from '@testing-library/react';

import { queryKeys } from '@/data/queries/queryKeys';
import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { VAULT_PLAN_CODE } from '@/module.constants';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';
import { createQueryClientTest } from '@/test-utils/testWrapperProviders';

import { ConsumptionDetails } from '../ConsumptionDetails.component';

vi.mock('@/hooks/useRequiredParams', () => {
  return {
    useRequiredParams: vi.fn().mockReturnValue({
      vaultId: mockVaults[0]!.id,
    }),
  };
});

describe('ConsumptionDetails component a11y', () => {
  it('Should render ConsumptionDetails component', async () => {
    const queryClient = createQueryClientTest();
    queryClient.setQueryData(queryKeys.consumption.byResource(mockVaults[0]!.id), [
      { planCode: VAULT_PLAN_CODE, quantity: 100 },
    ]);

    const wrapper = await testWrapperBuilder().withQueryClient(queryClient).build();

    const { container } = render(<ConsumptionDetails />, { wrapper });

    await expect(container).toBeAccessible();
  });
});
