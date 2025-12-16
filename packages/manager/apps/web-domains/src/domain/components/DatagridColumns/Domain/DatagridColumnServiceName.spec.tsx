import '@/common/setupTests';
import React from 'react';
import { render, screen } from '@/common/utils/test.provider';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import DatagridColumnServiceName from './DatagridColumnServiceName';
import { wrapper } from '@/common/utils/test.provider';
import { UseQueryResult } from '@tanstack/react-query';

vi.mock('@ovh-ux/manager-react-shell-client', () => {
  const mockShellContext = {
    environment: {
      getUser: () => ({
        ovhSubsidiary: 'FR',
      }),
    },
  };

  return {
    ShellContext: React.createContext(mockShellContext),
    useNavigationGetUrl: (
      linkParams: [string, string, unknown],
    ): UseQueryResult<unknown, Error> => {
      return {
        data: `https://ovh.test/#/${linkParams[0]}${linkParams[1]}`,
      } as UseQueryResult<unknown, Error>;
    },
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

  it('should wrap link with router Link component', () => {
    render(<DatagridColumnServiceName domainName={mockDomainName} />, {
      wrapper,
    });

    const routerLink = screen.getByTestId(mockDomainName);
    expect(routerLink).toBeInTheDocument();
  });
});
