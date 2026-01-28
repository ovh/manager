import React from 'react';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ICON_NAME } from '@ovhcloud/ods-react';

import { ObsBreadcrumb } from '@/components/breadcrumb/ObsBreadcrumb.component';
import { BreadcrumbItem } from '@/types/breadcrumb/Breadcrumb.types';

const mockUseObsBreadcrumb = vi.fn<() => BreadcrumbItem[]>();

vi.mock('@/hooks/breadcrumb/useObsBreadcrumb.hook', () => ({
  useObsBreadcrumb: () => mockUseObsBreadcrumb(),
}));

// Mock ODS components
vi.mock('@ovhcloud/ods-react', async () => {
  const actual = await vi.importActual('@ovhcloud/ods-react');
  return {
    ...actual,
    Breadcrumb: ({ children, ...props }: React.PropsWithChildren<{ 'aria-label'?: string }>) => (
      <nav data-testid="breadcrumb" aria-label={props['aria-label']}>
        <ol>{children}</ol>
      </nav>
    ),
    BreadcrumbItem: ({ children }: React.PropsWithChildren) => (
      <li data-testid="breadcrumb-item">{children}</li>
    ),
    BreadcrumbLink: ({
      children,
      to,
      href,
      'aria-label': ariaLabel,
      'aria-current': ariaCurrent,
    }: React.PropsWithChildren<{
      to?: string;
      href?: string;
      'aria-label'?: string;
      'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | boolean;
    }>) => (
      <a
        href={to || href}
        data-testid="breadcrumb-link"
        aria-label={ariaLabel}
        aria-current={ariaCurrent}
      >
        {children}
      </a>
    ),
    Icon: ({ name }: { name: string }) => <span data-testid="icon" data-icon={name} />,
    ICON_NAME: {
      home: 'home',
    },
  };
});

const mockBreadcrumbItems: BreadcrumbItem[] = [
  {
    key: 'root',
    icon: ICON_NAME.home,
    href: 'https://www.ovh.com/manager/#/',
    hidden: false,
    ariaLabel: 'Home',
    isLast: false,
  },
  {
    key: 'route-0-metrics',
    label: 'Metrics',
    to: '/metrics',
    hidden: false,
    isLast: false,
  },
  {
    key: 'route-1-tenants',
    label: 'Tenants',
    to: '/metrics/tenants',
    hidden: false,
    isLast: true,
  },
];

describe('ObsBreadcrumb', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseObsBreadcrumb.mockReturnValue(mockBreadcrumbItems);
  });

  describe('rendering', () => {
    it('should render breadcrumb navigation', () => {
      render(<ObsBreadcrumb />);

      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumb')).toHaveAttribute(
        'aria-label',
        'Breadcrumb navigation',
      );
    });

    it('should render breadcrumb items', () => {
      render(<ObsBreadcrumb />);

      const items = screen.getAllByTestId('breadcrumb-item');
      expect(items).toHaveLength(3); // root + metrics + tenants
    });

    it('should render home icon for root item', () => {
      render(<ObsBreadcrumb />);

      const icon = screen.getByTestId('icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-icon', 'home');
    });

    it('should render text labels for non-icon items', () => {
      render(<ObsBreadcrumb />);

      expect(screen.getByText('Metrics')).toBeInTheDocument();
      expect(screen.getByText('Tenants')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should set aria-label on root link', () => {
      render(<ObsBreadcrumb />);

      const links = screen.getAllByTestId('breadcrumb-link');
      const rootLink = links[0];
      expect(rootLink).toHaveAttribute('aria-label', 'Home');
    });

    it('should set aria-current="page" on last item', () => {
      render(<ObsBreadcrumb />);

      const links = screen.getAllByTestId('breadcrumb-link');
      const lastLink = links[links.length - 1];
      expect(lastLink).toHaveAttribute('aria-current', 'page');
    });

    it('should not set aria-current on non-last items', () => {
      render(<ObsBreadcrumb />);

      const links = screen.getAllByTestId('breadcrumb-link');
      const firstLink = links[0];
      expect(firstLink).not.toHaveAttribute('aria-current');
    });
  });

  describe('hidden items', () => {
    it('should not render hidden items', () => {
      mockUseObsBreadcrumb.mockReturnValue([
        {
          key: 'root',
          icon: ICON_NAME.home,
          href: '/',
          hidden: false,
          isLast: false,
        },
        {
          key: 'visible',
          label: 'Visible',
          to: '/visible',
          hidden: false,
          isLast: false,
        },
        {
          key: 'hidden',
          label: 'Hidden',
          to: '/hidden',
          hidden: true,
          isLast: true,
        },
      ]);

      render(<ObsBreadcrumb />);

      expect(screen.getByText('Visible')).toBeInTheDocument();
      expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should return null when no visible items', () => {
      mockUseObsBreadcrumb.mockReturnValue([
        {
          key: 'root',
          icon: ICON_NAME.home,
          href: '/',
          hidden: true,
          isLast: true,
        },
      ]);

      const { container } = render(<ObsBreadcrumb />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('links', () => {
    it('should render links with correct href for internal navigation', () => {
      render(<ObsBreadcrumb />);

      const links = screen.getAllByTestId('breadcrumb-link');
      expect(links[1]).toHaveAttribute('href', '/metrics'); // Metrics link (to)
    });

    it('should render links with correct href for external navigation', () => {
      render(<ObsBreadcrumb />);

      const links = screen.getAllByTestId('breadcrumb-link');
      expect(links[0]).toHaveAttribute('href', 'https://www.ovh.com/manager/#/'); // Root link (href)
    });
  });
});
