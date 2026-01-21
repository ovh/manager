import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { urlParams, urls } from '@/routes/routes.constants';

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
    useHref: vi.fn().mockImplementation((link) => link),
  };
});

vi.mock('react-router-dom', () => ({
  useHref,
}));

describe('VaultIdCell', () => {
  it('renders link with targetSpec.name as label and default href', () => {
    const vault = mockVaults[0]!;

    render(<VaultIdCell id={vault.id} name={vault.currentState.name} />);

    expect(useHref).toBeCalled();

    const link = screen.getByTestId('link');

    expect(link).toHaveTextContent(vault.currentState.name);
    expect(link.getAttribute('href')).toBe(
      urls.dashboardVaults.replace(urlParams.vaultId, vault.id),
    );
    expect(link.getAttribute('href')?.endsWith(`/${vault.id}`)).toBe(true);
  });
});
