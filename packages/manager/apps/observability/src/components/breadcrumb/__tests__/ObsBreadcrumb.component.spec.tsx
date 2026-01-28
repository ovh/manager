import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ICON_NAME } from '@ovhcloud/ods-react';

// Import component after mocks
import { ObsBreadcrumb } from '@/components/breadcrumb/ObsBreadcrumb.component';
import { BreadcrumbConfig } from '@/types/breadcrumb/Breadcrumb.types';

// Mock translations
const mockT = vi.fn((key: string) => {
  const translations: Record<string, string> = {
    'breadcrumb:metrics': 'Metrics',
    'breadcrumb:tenants': 'Tenants',
    'breadcrumb:root_aria_label': 'Home',
  };
  return translations[key] || key;
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
  }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const ReactModule = await import('react');
  return {
    ShellContext: ReactModule.createContext({
      shell: {
        navigation: {
          getURL: vi.fn().mockResolvedValue('/'),
        },
      },
      environment: {},
    }),
  };
});

vi.mock('@/routes/Routes.base', () => ({
  getRoot: () => '',
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
      'aria-label': ariaLabel,
      'aria-current': ariaCurrent,
    }: React.PropsWithChildren<{
      to: string;
      'aria-label'?: string;
      'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | boolean;
    }>) => (
      <a href={to} data-testid="breadcrumb-link" aria-label={ariaLabel} aria-current={ariaCurrent}>
        {children}
      </a>
    ),
    Icon: ({ name }: { name: string }) => <span data-testid="icon" data-icon={name} />,
    ICON_NAME: {
      home: 'home',
    },
  };
});

const testConfig: BreadcrumbConfig = {
  root: {
    icon: ICON_NAME.home,
    ariaLabel: 'breadcrumb:root_aria_label',
    path: '/',
  },
  routes: [
    {
      pattern: '/metrics/tenants',
      items: [
        { labelKey: 'breadcrumb:metrics', path: '/metrics' },
        { labelKey: 'breadcrumb:tenants' },
      ],
    },
    {
      pattern: '/metrics',
      items: [{ labelKey: 'breadcrumb:metrics' }],
    },
  ],
  fallbackToPathBased: true,
};

const renderWithRouter = (ui: React.ReactElement, initialEntries: string[] = ['/']) =>
  render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);

describe('ObsBreadcrumb', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render breadcrumb navigation', () => {
      renderWithRouter(<ObsBreadcrumb config={testConfig} />, ['/metrics']);

      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumb')).toHaveAttribute(
        'aria-label',
        'Breadcrumb navigation',
      );
    });

    it('should render breadcrumb items', () => {
      renderWithRouter(<ObsBreadcrumb config={testConfig} />, ['/metrics/tenants']);

      const items = screen.getAllByTestId('breadcrumb-item');
      expect(items).toHaveLength(3); // root + metrics + tenants
    });

    it('should render home icon for root item', () => {
      renderWithRouter(<ObsBreadcrumb config={testConfig} />, ['/metrics']);

      const icon = screen.getByTestId('icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-icon', 'home');
    });

    it('should render text labels for non-icon items', () => {
      renderWithRouter(<ObsBreadcrumb config={testConfig} />, ['/metrics/tenants']);

      expect(screen.getByText('Metrics')).toBeInTheDocument();
      expect(screen.getByText('Tenants')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should set aria-label on root link', () => {
      renderWithRouter(<ObsBreadcrumb config={testConfig} />, ['/metrics']);

      const links = screen.getAllByTestId('breadcrumb-link');
      const rootLink = links[0];
      expect(rootLink).toHaveAttribute('aria-label', 'Home');
    });

    it('should set aria-current="page" on last item', () => {
      renderWithRouter(<ObsBreadcrumb config={testConfig} />, ['/metrics/tenants']);

      const links = screen.getAllByTestId('breadcrumb-link');
      const lastLink = links[links.length - 1];
      expect(lastLink).toHaveAttribute('aria-current', 'page');
    });

    it('should not set aria-current on non-last items', () => {
      renderWithRouter(<ObsBreadcrumb config={testConfig} />, ['/metrics/tenants']);

      const links = screen.getAllByTestId('breadcrumb-link');
      const firstLink = links[0];
      expect(firstLink).not.toHaveAttribute('aria-current');
    });
  });

  describe('hidden items', () => {
    it('should not render hidden items', () => {
      const configWithHidden: BreadcrumbConfig = {
        root: { icon: ICON_NAME.home, path: '/' },
        routes: [
          {
            pattern: '/test',
            items: [{ label: 'Visible' }, { label: 'Hidden', hidden: true }],
          },
        ],
        fallbackToPathBased: false,
      };

      renderWithRouter(<ObsBreadcrumb config={configWithHidden} />, ['/test']);

      expect(screen.getByText('Visible')).toBeInTheDocument();
      expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should return null when no visible items', () => {
      const emptyConfig: BreadcrumbConfig = {
        root: { icon: ICON_NAME.home, path: '/', hidden: true },
        routes: [],
        fallbackToPathBased: false,
      };

      const { container } = renderWithRouter(<ObsBreadcrumb config={emptyConfig} />, ['/unknown']);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('links', () => {
    it('should render links with correct href', () => {
      renderWithRouter(<ObsBreadcrumb config={testConfig} />, ['/metrics/tenants']);

      const links = screen.getAllByTestId('breadcrumb-link');
      expect(links[1]).toHaveAttribute('href', '/metrics'); // Metrics link
    });
  });

  describe('default config', () => {
    it('should use default config from routes when not provided', () => {
      // This tests that the component works with the default breadcrumbConfig import
      renderWithRouter(<ObsBreadcrumb />, ['/metrics/tenants']);

      // Should render something (exact content depends on default config)
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });
  });
});
