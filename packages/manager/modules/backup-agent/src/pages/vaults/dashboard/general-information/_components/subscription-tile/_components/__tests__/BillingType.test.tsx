import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { mockVaults } from '@/mocks/vaults/vaults.mock';

import { BillingType } from '../BillingType.component';

const { useQuery } = vi.hoisted(() => ({
  useQuery: vi.fn(),
}));

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

vi.mock('@/data/hooks/consumption/useServiceConsumption', () => {
  return {
    useGetServiceConsumptionOptions: vi.fn().mockReturnValue(vi.fn()),
  };
});

describe('BillingType component a11y', () => {
  it('Should render BillingType component', async () => {
    useQuery.mockReturnValue({ data: [], isPending: false });
    const { container } = render(<BillingType />);

    await expect(container).toBeAccessible();
  });
});
