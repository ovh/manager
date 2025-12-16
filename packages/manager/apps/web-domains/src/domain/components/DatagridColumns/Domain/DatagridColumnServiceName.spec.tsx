import '@/common/setupTests';
import React from 'react';
import { render, screen } from '@/common/utils/test.provider';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import DatagridColumnServiceName from './DatagridColumnServiceName';
import { wrapper } from '@/common/utils/test.provider';

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@ovh-ux/manager-react-shell-client')
  >();
  return {
    ...actual,
    useNavigationGetUrl: vi.fn(),
  };
});

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="datagrid-text-cell">{children}</div>
  ),
}));

vi.mock('@ovh-ux/muk', () => ({
  CellRow: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cell-row">{children}</div>
  ),
}));

vi.mock('@ovhcloud/ods-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovhcloud/ods-react')>();
  return {
    ...actual,
    Link: ({
      children,
      href,
      'data-testid': testId,
    }: {
      children: React.ReactNode;
      href: string;
      'data-testid': string;
    }) => (
      <a data-testid={testId} href={href}>
        {children}
      </a>
    ),
  };
});

describe('DatagridColumnServiceName', () => {
  const mockDomainName = 'example.com';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigationGetUrl).mockReturnValue({
      data: `https://ovh.test/#/domain/${mockDomainName}/information`,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as any);
  });

  it('should render domain name as a link', () => {
    render(<DatagridColumnServiceName domainName={mockDomainName} />, {
      wrapper,
    });

    expect(screen.getByTestId('cell-row')).toBeInTheDocument();

    const link = screen.getByTestId(mockDomainName);
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent(mockDomainName);
    expect(link).toHaveAttribute(
      'href',
      `https://ovh.test/#/domain/${mockDomainName}/information`,
    );
  });

  it('should wrap link with router Link component', () => {
    render(<DatagridColumnServiceName domainName={mockDomainName} />, {
      wrapper,
    });

    const routerLink = screen.getByTestId(mockDomainName);
    expect(routerLink).toBeInTheDocument();
  });
});
