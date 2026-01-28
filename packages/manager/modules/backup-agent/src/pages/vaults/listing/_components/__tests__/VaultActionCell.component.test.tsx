import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { urlParams, urls } from '@/routes/routes.constants';

import { VaultActionCell } from '../VaultActionCell.component';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cell">{children}</div>
  ),
}));

vi.mock('@/components/CommonCells/ArrowLinkCell/ArrowLinkCell.component', () => ({
  ArrowLinkCell: ({ children, ...props }: { children: React.ReactNode; props: React.ComponentProps<typeof VaultActionCell>}) => (
    <a {...props}>{children}</a>
  ),
}));

const { useHref } = vi.hoisted(() => {
  return { useHref: vi.fn().mockImplementation((link) => link) };
});

vi.mock('react-router-dom', () => ({ useHref }));

describe('VaultActionCell', () => {
  it('should render ArrowLinkCell with href',async  () => {
    const vault = mockVaults[0]!;
   
     render(<VaultActionCell id={vault.id} />);

    expect(useHref).toBeCalled();

    expect(screen.getByRole('link')).toHaveAttribute('href',
      urls.dashboardVaults.replace(urlParams.vaultId, vault.id),
    );
  });
});
