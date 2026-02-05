import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { DataGridTextCellMock } from '@/test-utils/mocks/manager-react-components';
import { useHrefMock } from '@/test-utils/mocks/react-router-dom';

import { VaultActionCell } from '../VaultActionCell.component';

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();

  return {
    ...actual,
    DataGridTextCell: DataGridTextCellMock,
  };
});

vi.mock('react-router-dom', () => ({
  useHref: useHrefMock
}));

describe('VaultActionCell', () => {
  it('should render' , () => {
    const vault = mockVaults[0]!;
    render(<VaultActionCell id={vault.id} />);

    const button = screen.getByTestId('arrow-link-cell');
    expect(button).toHaveAttribute('href', '/vaults/dashboard/a1b2c3d4-1234-4000-82dc-5366d6786f80');
  })
});
