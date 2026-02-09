import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { queryKeys } from '@/data/queries/queryKeys';
import { BACKUP_AGENT_NAMESPACES } from '@/lib';
import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { VAULT_PLAN_CODE } from '@/module.constants';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';
import { createQueryClientTest } from '@/test-utils/testWrapperProviders';

import { SubscriptionTile } from '../subscription-tile/SubscriptionTile.component';

const LABELS_VISIBLES = [
  `${NAMESPACES.BILLING}:subscription`,
  `${NAMESPACES.DASHBOARD}:consumption`,
  `${BACKUP_AGENT_NAMESPACES.VAULT_DASHBOARD}:type_billing`,
];

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn().mockReturnValue({
    t: vi.fn().mockImplementation((key: string) => key),
  }),
}));

vi.mock('@/hooks/useRequiredParams', () => {
  return {
    useRequiredParams: vi.fn().mockReturnValue({
      vaultId: mockVaults[0]!.id,
    }),
  };
});

describe('SubscriptionTile', () => {
  it('Should render SubscriptionTile component', async () => {
    const queryClient = createQueryClientTest();
    queryClient.setQueryData(queryKeys.vaults.detail(mockVaults[0]!.id), mockVaults[0]!);
    queryClient.setQueryData(queryKeys.consumption.byResource(mockVaults[0]!.id), [
      { planCode: VAULT_PLAN_CODE, quantity: 100, price: { text: '100 €' } },
    ]);

    const wrapper = await testWrapperBuilder().withQueryClient(queryClient).build();

    const { container } = render(<SubscriptionTile vaultId={mockVaults[0]!.id} />, { wrapper });

    await expect(container).toBeAccessible();

    LABELS_VISIBLES.forEach((label) => {
      expect(screen.getByText(label)).toBeVisible();
    });
  });
});
