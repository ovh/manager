import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockVaults } from '@/mocks/vaults/vaults';
import { ResourceStatusCell } from '../ResourceStatusCell.components';
import { ResourceStatus } from '@/types/Resource.type';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@/components/ResourceStatusBadge/ResourceStatusBadge.components', () => ({
  // eslint-disable-next-line react/no-multi-comp
  ResourceStatusBadge: ({ vaultStatus }: { vaultStatus: ResourceStatus }) => (
    <span data-testid="badge">
      {vaultStatus}
    </span>
  ),
}));

describe('ResourceStatusCell', () => {
  it.each([
    ['READY'],
    ['ERROR'],
  ])('renders vaults with status %s correctly: %s', (status) => {
    const vault = { ...mockVaults[0]!, resourceStatus: status as ResourceStatus };

    render(<ResourceStatusCell {...vault} />);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent(vault.resourceStatus);
  });
});
