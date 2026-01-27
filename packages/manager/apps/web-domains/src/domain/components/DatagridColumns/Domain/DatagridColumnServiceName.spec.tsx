import '@/common/setupTests';
import React from 'react';
import { render, screen } from '@/common/utils/test.provider';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import DatagridColumnServiceName from './DatagridColumnServiceName';
import { wrapper } from '@/common/utils/test.provider';


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

    expect(screen.getByTestId('example.com')).toBeInTheDocument();

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
