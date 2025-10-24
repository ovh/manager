import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockVaults } from '@/mocks/vaults/vaults';
import { urlParams, urls } from '@/routes/Routes.constants';

import { VaultIdCell } from '../VaultIdCell.component';

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
    useHref: vi.fn().mockImplementation((link: string) => link),
  };
});

vi.mock('react-router-dom', () => ({
  useHref,
}));

describe('VaultIdCell', () => {
  it('renders link with targetSpec.name as label and default href', () => {
    const vault = mockVaults[0]!;

    render(<VaultIdCell {...vault} />);

    expect(useHref).toBeCalled();

    const link = screen.getByTestId('link');
    expect(link).toHaveTextContent(vault.currentState.name);
    expect(link.getAttribute('href')).toBe(urls.dashboard.replace(urlParams.vaultId, vault.id));
    expect(link.getAttribute('href')?.endsWith(`/${vault.id}`)).toBe(true);
  });
});
