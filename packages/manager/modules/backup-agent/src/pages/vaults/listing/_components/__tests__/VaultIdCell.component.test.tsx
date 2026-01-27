import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { urlParams, urls } from '@/routes/routes.constants';
import { DataGridTextCellMock, LinksMock } from '@/test-utils/mocks/manager-react-components';
import { useHrefMock } from '@/test-utils/mocks/react-router-dom';

import { VaultIdCell } from '../VaultIdCell.component';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: DataGridTextCellMock,
  Links: LinksMock,
}));

vi.mock('react-router-dom', () => ({
  useHref: useHrefMock,
}));

describe('VaultIdCell', () => {
  it('renders link with targetSpec.name as label and default href', () => {
    const vault = mockVaults[0]!;

    render(<VaultIdCell {...vault} />);

    expect(useHrefMock).toBeCalled();

    const link = screen.getByTestId('link');
    expect(link).toHaveTextContent(vault.currentState.name);
    expect(link.getAttribute('href')).toBe(
      urls.dashboardVaults.replace(urlParams.vaultId, vault.id),
    );
    expect(link.getAttribute('href')?.endsWith(`/${vault.id}`)).toBe(true);
  });
});
