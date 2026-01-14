import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AgentDataLocationCell } from '../AgentDataLocationCell.component';

const { useBackupVaultDetailsMock } = vi.hoisted(() => ({
  useBackupVaultDetailsMock: vi.fn(),
}));

vi.mock('@/data/hooks/vaults/getVaultDetails', () => ({
  useBackupVaultDetails: useBackupVaultDetailsMock,
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="DataGridTextCell">{children}</div>
  ),
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsSkeleton: () => <div data-testid="OdsSkeleton" />,
}));

vi.mock('@/components/CommonCells/ResourceLocationCell/ResourceLocationCell.component', () => ({
  ResourceLocationCell: ({ region }: { region: string }) => (
    <div data-testid="ResourceLocationCell">{region}</div>
  ),
}));

describe('AgentDataLocationCell', () => {
  it('renders "-" when vaultId is not provided', () => {
    useBackupVaultDetailsMock.mockReturnValue({
      data: undefined,
      isPending: true,
    });

    render(<AgentDataLocationCell vaultId={undefined} />);

    expect(screen.getByTestId('DataGridTextCell')).toHaveTextContent('-');
  });

  it('renders OdsSkeleton when isPending is true', () => {
    useBackupVaultDetailsMock.mockReturnValue({
      data: undefined,
      isPending: true,
    });

    render(<AgentDataLocationCell vaultId="vault-id" />);

    expect(screen.getByTestId('OdsSkeleton')).toBeInTheDocument();
  });

  it('renders OdsSkeleton when data is not available', () => {
    useBackupVaultDetailsMock.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
    });

    render(<AgentDataLocationCell vaultId="vault-id" />);

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders ResourceLocationCell when data is available', () => {
    const mockData = {
      currentState: {
        region: 'GRA',
      },
    };
    useBackupVaultDetailsMock.mockReturnValue({
      data: mockData,
      isPending: false,
    });

    render(<AgentDataLocationCell vaultId="vault-id" />);

    expect(screen.getByTestId('ResourceLocationCell')).toHaveTextContent('GRA');
  });
});
