import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_AGENT_NAMESPACES } from '@/lib';
import { mockVaults } from '@/mocks/vaults/vaults';

import { SubscriptionTile } from '../subscription-tile/SubscriptionTile.component';

const LABELS_VISIBLES = [
  `${NAMESPACES.BILLING}:subscription`,
  `${NAMESPACES.DASHBOARD}:consumption`,
  `${BACKUP_AGENT_NAMESPACES.VAULT_DASHBOARD}:type_billing`,
];

const { useBackupVaultDetailsMock } = vi.hoisted(() => ({
  useBackupVaultDetailsMock: vi.fn(),
}));

vi.mock('@/data/hooks/vaults/getVaultDetails', () => ({
  useBackupVaultDetails: useBackupVaultDetailsMock,
}));

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn().mockReturnValue({
    t: vi.fn().mockImplementation((key: string) => key),
  }),
}));

describe('SubscriptionTile', () => {
  it('Should render SubscriptionTile component', async () => {
    useBackupVaultDetailsMock.mockReturnValue({ data: mockVaults[0]!, isLoading: false });
    const { container } = render(<SubscriptionTile vaultId={mockVaults[0]!.id} />);

    await expect(container).toBeAccessible();

    LABELS_VISIBLES.forEach((label) => {
      expect(screen.getByText(label)).toBeVisible();
    });
  });
});
