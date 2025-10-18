import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockVaults } from '@/mocks/vault/vaults';
import { VaultStatusCell } from '@/pages/listing/_components';
import { ResourceStatus } from '@/types/Vault.type';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@/components/VaultStatusBadge/VaultStatusBadge.components', () => ({
  // eslint-disable-next-line react/no-multi-comp
  VaultStatusBadge: ({ vaultStatus }: { vaultStatus: ResourceStatus }) => (
    <span data-testid="badge">
      {vaultStatus}
    </span>
  ),
}));

describe('VaultStatusCell', () => {
  it.each([
    ['READY'],
    ['ERROR'],
  ])('renders vault with status %s correctly: %s', (status) => {
    const vault = { ...mockVaults[0]!, resourceStatus: status as ResourceStatus };

    render(<VaultStatusCell {...vault} />);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent(vault.resourceStatus);
  });
});
