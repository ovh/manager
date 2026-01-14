import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { ResourceStatus } from '@/types/Resource.type';

import { ResourceStatusCell } from '../ResourceStatusCell.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@/components/ResourceStatusBadge/ResourceStatusBadge.component', () => ({
  ResourceStatusBadge: ({ resourceStatus }: { resourceStatus: ResourceStatus }) => (
    <span data-testid="badge">{resourceStatus}</span>
  ),
}));

describe('ResourceStatusCell', () => {
  it.each([['READY'], ['ERROR']])('renders vaults with status %s correctly: %s', (status) => {
    const vault = { ...mockVaults[0]!, resourceStatus: status as ResourceStatus };

    render(<ResourceStatusCell resourceStatus={vault.resourceStatus} />);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent(vault.resourceStatus);
  });
});
