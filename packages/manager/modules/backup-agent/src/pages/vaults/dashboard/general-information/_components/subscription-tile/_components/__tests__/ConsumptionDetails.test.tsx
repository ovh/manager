import { render } from '@testing-library/react';

import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { VAULT_PLAN_CODE } from '@/module.constants';

import { ConsumptionDetails } from '../ConsumptionDetails.component';

const { useQuery } = vi.hoisted(() => ({
  useQuery: vi.fn(),
}));

vi.mock('@/data/hooks/consumption/useServiceConsumption', () => {
  return {
    useGetServiceConsumptionOptions: vi.fn().mockReturnValue(vi.fn()),
  };
});

vi.mock('@tanstack/react-query', () => {
  return {
    useQuery: useQuery,
  };
});

vi.mock('@/hooks/useRequiredParams', () => {
  return {
    useRequiredParams: vi.fn().mockReturnValue({
      vaultId: mockVaults[0]!.id,
    }),
  };
});

describe('ConsumptionDetails component a11y', () => {
  it('Should render ConsumptionDetails component', async () => {
    useQuery.mockReturnValue({
      data: [{ planCode: VAULT_PLAN_CODE, quantity: 100 }],
      isPending: false,
    });

    const { container } = render(<ConsumptionDetails />);

    await expect(container).toBeAccessible();
  });
});
