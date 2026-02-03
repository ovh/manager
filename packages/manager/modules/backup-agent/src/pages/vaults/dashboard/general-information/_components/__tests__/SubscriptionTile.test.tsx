import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_AGENT_NAMESPACES } from '@/lib';
import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { VAULT_PLAN_CODE } from '@/module.constants';

import { SubscriptionTile } from '../subscription-tile/SubscriptionTile.component';

const LABELS_VISIBLES = [
  `${NAMESPACES.BILLING}:subscription`,
  `${NAMESPACES.DASHBOARD}:consumption`,
  `${BACKUP_AGENT_NAMESPACES.VAULT_DASHBOARD}:type_billing`,
];

vi.mock('@/data/hooks/consumption/useServiceConsumption', () => {
  return {
    useGetServiceConsumptionOptions: vi.fn().mockReturnValue(vi.fn()),
  };
});

const { useBackupVaultDetailsMock, useQuery } = vi.hoisted(() => ({
  useBackupVaultDetailsMock: vi.fn(),
  useQuery: vi.fn(),
}));

vi.mock('@/data/hooks/vaults/getVaultDetails', () => ({
  useBackupVaultDetails: useBackupVaultDetailsMock,
}));

vi.mock('@tanstack/react-query', () => {
  return {
    useQuery: useQuery,
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn().mockReturnValue({
    t: vi.fn().mockImplementation((key: string) => key),
  }),
}));

vi.mock('@/hooks/useRequiredParams', () => {
  return {
    useRequiredParams: vi.fn().mockReturnValue({
      tenantId: TENANTS_MOCKS[0]!.id,
    }),
  };
});

describe('SubscriptionTile', () => {
  it('Should render SubscriptionTile component', async () => {
    useBackupVaultDetailsMock.mockReturnValue({ data: mockVaults[0]!, isLoading: false });
    useQuery.mockReturnValue({
      data: [{ planCode: VAULT_PLAN_CODE, quantity: 100, price: { text: '100 €' } }],
      isPending: false,
    });
    const { container } = render(<SubscriptionTile vaultId={mockVaults[0]!.id} />);

    await expect(container).toBeAccessible();

    LABELS_VISIBLES.forEach((label) => {
      expect(screen.getByText(label)).toBeVisible();
    });
  });
});
