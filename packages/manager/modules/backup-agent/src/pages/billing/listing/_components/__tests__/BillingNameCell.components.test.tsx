import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { urlParams, urls } from '@/routes/routes.constants';
import { DataGridTextCellMock, LinksMock } from '@/test-utils/mocks/manager-react-components';
import { useHrefMock } from '@/test-utils/mocks/react-router-dom';

import { BillingNameCell } from '../BillingNameCell.components';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: DataGridTextCellMock,
  Links: LinksMock,
}));

vi.mock('react-router-dom', () => ({
  useHref: useHrefMock,
}));

describe('VaultIdCell', () => {
  it('renders link with targetSpec.name as label and default href', () => {
    render(<BillingNameCell id={mockVaults[0]!.id} name={mockVaults[0]!.currentState.name} />);

    expect(useHrefMock).toBeCalled();

    const link = screen.getByTestId('link');
    expect(link).toHaveTextContent(mockVaults[0]!.currentState.name);
    expect(link.getAttribute('href')).toBe(
      urls.dashboardVaults.replace(urlParams.vaultId, `${mockVaults[0]!.id}`),
    );
    expect(link.getAttribute('href')?.endsWith(`/${mockVaults[0]!.id}`)).toBe(true);
  });
});
