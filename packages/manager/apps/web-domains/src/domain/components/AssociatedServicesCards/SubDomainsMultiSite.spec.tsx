import '@/common/setupTests';
import React, { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/common/utils/test.provider';
import { wrapper } from '@/common/utils/test.provider';
import SubDomainsMultiSite from './SubDomainsMultiSite';
import { useGetSubDomainsAndMultiSites } from '@/domain/hooks/data/query';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetSubDomainsAndMultiSites: vi.fn(),
}));

vi.mock('@ovhcloud/ods-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovhcloud/ods-react')>();
  return {
    ...actual,
    Link: ({ href, children, ...props }: { href?: string; children?: ReactNode; [key: string]: unknown }) => (
      <a href={href} data-testid="subdomain-link" {...props}>
        {children}
      </a>
    ),
    Text: ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
      <span data-testid="text" {...props}>
        {children}
      </span>
    ),
  };
});

describe('SubDomainsMultiSite Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      serviceNames: ['hosting1.com', 'hosting2.com'],
      ...props,
    };

    return render(<SubDomainsMultiSite {...defaultProps} />, { wrapper });
  };

  describe('when there are no subdomains', () => {
    beforeEach(() => {
      vi.mocked(useGetSubDomainsAndMultiSites).mockReturnValue([
        { data: [], isLoading: false, isSuccess: true },
        { data: [], isLoading: false, isSuccess: true },
      ] as ReturnType<typeof useGetSubDomainsAndMultiSites>);
    });

    it('should render the component', () => {
      renderComponent();
      expect(screen.getByTestId('manager-tile-item')).toBeInTheDocument();
    });

    it('should display the no service message', () => {
      renderComponent();
      expect(screen.getByTestId('text')).toHaveTextContent(
        'domain_tab_general_information_associated_subdomains_multisite_content',
      );
    });

    it('should display label', () => {
      renderComponent();
      expect(screen.getByTestId('tile-label')).toHaveTextContent(
        'domain_tab_general_information_associated_subdomains_multisite',
      );
    });
  });

  describe('when there are subdomains', () => {
    beforeEach(() => {
      vi.mocked(useGetSubDomainsAndMultiSites).mockReturnValue([
        {
          data: ['sub1.hosting1.com', 'sub2.hosting1.com'],
          isLoading: false,
          isSuccess: true,
        },
        {
          data: ['sub1.hosting2.com'],
          isLoading: false,
          isSuccess: true,
        },
      ] as ReturnType<typeof useGetSubDomainsAndMultiSites>);
    });

    it('should display the list of subdomains', () => {
      renderComponent();
      const links = screen.getAllByTestId('subdomain-link');
      expect(links).toHaveLength(3);
      expect(links[0]).toHaveTextContent('sub1.hosting1.com');
      expect(links[1]).toHaveTextContent('sub2.hosting1.com');
      expect(links[2]).toHaveTextContent('sub1.hosting2.com');
    });

    it('should render subdomain links with correct href', () => {
      renderComponent();
      const links = screen.getAllByTestId('subdomain-link');
      expect(links[0]).toHaveAttribute('href', 'https://sub1.hosting1.com');
      expect(links[1]).toHaveAttribute('href', 'https://sub2.hosting1.com');
      expect(links[2]).toHaveAttribute('href', 'https://sub1.hosting2.com');
    });
  });

  describe('when queries are loading', () => {
    beforeEach(() => {
      vi.mocked(useGetSubDomainsAndMultiSites).mockReturnValue([
        { data: undefined, isLoading: true, isSuccess: false },
        { data: undefined, isLoading: true, isSuccess: false },
      ] as ReturnType<typeof useGetSubDomainsAndMultiSites>);
    });

    it('should display no content message while loading', () => {
      renderComponent();
      expect(screen.getByTestId('text')).toHaveTextContent(
        'domain_tab_general_information_associated_subdomains_multisite_content',
      );
    });
  });

  describe('when some queries fail', () => {
    beforeEach(() => {
      vi.mocked(useGetSubDomainsAndMultiSites).mockReturnValue([
        {
          data: ['sub1.hosting1.com'],
          isLoading: false,
          isSuccess: true,
        },
        {
          data: undefined,
          isLoading: false,
          isSuccess: false,
          error: new Error('Failed to fetch'),
        },
      ] as ReturnType<typeof useGetSubDomainsAndMultiSites>);
    });

    it('should display subdomains from successful queries only', () => {
      renderComponent();
      const links = screen.getAllByTestId('subdomain-link');
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveTextContent('sub1.hosting1.com');
    });
  });

  describe('when serviceNames is empty', () => {
    beforeEach(() => {
      vi.mocked(useGetSubDomainsAndMultiSites).mockReturnValue(
        [] as ReturnType<typeof useGetSubDomainsAndMultiSites>,
      );
    });

    it('should display no content message', () => {
      renderComponent({ serviceNames: [] });
      expect(screen.getByTestId('text')).toHaveTextContent(
        'domain_tab_general_information_associated_subdomains_multisite_content',
      );
    });
  });

  describe('Props handling', () => {
    it('should pass serviceNames to the hook', () => {
      const serviceNames = ['test1.com', 'test2.com', 'test3.com'];
      vi.mocked(useGetSubDomainsAndMultiSites).mockReturnValue(
        [] as ReturnType<typeof useGetSubDomainsAndMultiSites>,
      );

      renderComponent({ serviceNames });

      expect(useGetSubDomainsAndMultiSites).toHaveBeenCalledWith(serviceNames);
    });

    it('should handle undefined serviceNames gracefully', () => {
      vi.mocked(useGetSubDomainsAndMultiSites).mockReturnValue(
        [] as ReturnType<typeof useGetSubDomainsAndMultiSites>,
      );

      renderComponent({ serviceNames: undefined });

      expect(useGetSubDomainsAndMultiSites).toHaveBeenCalledWith([]);
    });
  });
});
