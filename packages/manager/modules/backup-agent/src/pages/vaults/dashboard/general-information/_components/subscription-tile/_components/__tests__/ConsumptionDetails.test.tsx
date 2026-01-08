import { render } from '@testing-library/react';

import { mockVaults } from '@/mocks/vaults/vaults';
import { VAULT_PLAN_CODE } from '@/module.constants';

import { ConsumptionDetails } from '../ConsumptionDetails.component';

const { useServiceConsumptionMock } = vi.hoisted(() => ({
  useServiceConsumptionMock: vi.fn(),
}));

vi.mock('@/data/hooks/consumption/useServiceConsumption', () => {
  return {
    useServiceConsumption: useServiceConsumptionMock,
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
    useServiceConsumptionMock.mockReturnValue({
      data: [{ planCode: VAULT_PLAN_CODE, quantity: 100 }],
      isPending: false,
    });

    const { container } = render(<ConsumptionDetails />);

    await expect(container).toBeAccessible();
  });
});
