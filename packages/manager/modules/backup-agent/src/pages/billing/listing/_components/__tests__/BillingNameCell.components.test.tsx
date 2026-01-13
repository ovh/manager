import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { urlParams, urls } from '@/routes/routes.constants';

import { BillingNameCell } from '../BillingNameCell.components';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cell">{children}</div>
  ),

  Links: ({ label, href }: { label: string; href: string }) => (
    <a data-testid="link" href={href}>
      {label}
    </a>
  ),
}));

const { useHref } = vi.hoisted(() => {
  return {
    useHref: vi.fn().mockImplementation((link) => link),
  };
});

vi.mock('react-router-dom', () => ({
  useHref,
}));

describe('VaultIdCell', () => {
  it('renders link with targetSpec.name as label and default href', () => {
    render(<BillingNameCell id={mockVaults[0]!.id} name={mockVaults[0]!.currentState.name} />);

    expect(useHref).toBeCalled();

    const link = screen.getByTestId('link');
    expect(link).toHaveTextContent(mockVaults[0]!.currentState.name);
    expect(link.getAttribute('href')).toBe(
      urls.dashboardVaults.replace(urlParams.vaultId, `${mockVaults[0]!.id}`),
    );
    expect(link.getAttribute('href')?.endsWith(`/${mockVaults[0]!.id}`)).toBe(true);
  });
});
