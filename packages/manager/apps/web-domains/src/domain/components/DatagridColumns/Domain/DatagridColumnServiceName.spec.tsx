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

vi.mock('@ovhcloud/ods-react', () => ({
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
}));

describe('DatagridColumnServiceName', () => {
  const mockDomainName = 'example.com';

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigationGetUrl as ReturnType<typeof vi.fn>).mockReturnValue({
      data: `https://ovh.test/#/domain/${mockDomainName}/information`,
    });
  });

  it('should render domain name as a link', () => {
    render(<DatagridColumnServiceName domainName={mockDomainName} />, {
      wrapper,
    });

    expect(screen.getByTestId('datagrid-text-cell')).toBeInTheDocument();

    const link = screen.getByTestId(mockDomainName);
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent(mockDomainName);
    expect(link).toHaveAttribute(
      'href',
      `https://ovh.test/#/domain/${mockDomainName}/information`,
    );
  });

  it('should generate correct navigation path', () => {
    render(<DatagridColumnServiceName domainName={mockDomainName} />, {
      wrapper,
    });

    expect(useNavigationGetUrl).toHaveBeenCalledWith([
      'web-domains',
      `/domain/${mockDomainName}/information`,
      {},
    ]);
  });

  it('should wrap link with router Link component', () => {
    render(<DatagridColumnServiceName domainName={mockDomainName} />, {
      wrapper,
    });

    const routerLink = screen.getByTestId(mockDomainName);
    expect(routerLink).toBeInTheDocument();
  });
});
