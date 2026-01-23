import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ServiceLinks } from '@/pages/settings/services/links/ServiceLinks.component';

const { mockUseHref, mockUseObservabilityServiceContext, mockUseTenants } = vi.hoisted(() => ({
  mockUseHref: vi.fn((href: string) => href),
  mockUseObservabilityServiceContext: vi.fn(),
  mockUseTenants: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('react-router-dom', () => ({
  useHref: mockUseHref,
}));

vi.mock('@/contexts/ObservabilityService.context', () => ({
  useObservabilityServiceContext: mockUseObservabilityServiceContext,
}));

vi.mock('@/data/hooks/tenants/useTenants.hook', () => ({
  useTenants: mockUseTenants,
}));

vi.mock('@ovh-ux/muk', () => ({
  Tile: {
    Root: ({ title, children }: { title: string; children: React.ReactNode }) => (
      <section data-testid="tile-root">
        <h2>{title}</h2>
        {children}
      </section>
    ),
    Item: {
      Root: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="tile-item-root">{children}</div>
      ),
      Term: ({ label }: { label: string }) => <dt data-testid="tile-item-term">{label}</dt>,
      Description: ({ children }: { children: React.ReactNode }) => (
        <dd data-testid="tile-item-description">{children}</dd>
      ),
    },
  },
}));

vi.mock('@ovhcloud/ods-react', () => ({
  BADGE_COLOR: { neutral: 'neutral' },
  Badge: ({ children, color }: { children: React.ReactNode; color: string }) => (
    <span data-testid="badge" data-color={color}>
      {children}
    </span>
  ),
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a data-testid="tile-link" href={href}>
      {children}
    </a>
  ),
  TEXT_PRESET: { paragraph: 'paragraph' },
  Text: ({ children }: { children: React.ReactNode }) => <span data-testid="text">{children}</span>,
}));

vi.mock('@/components/dashboard/SkeletonWrapper.component', () => ({
  default: ({ isLoading, children }: { isLoading: boolean; children: React.ReactNode }) =>
    isLoading ? <div data-testid="skeleton">loading</div> : <>{children}</>,
}));

describe('ServiceLinks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseObservabilityServiceContext.mockReturnValue({
      selectedService: { id: 'service-123' },
    });
    mockUseTenants.mockReturnValue({
      data: [{ id: 'tenant-1' }, { id: 'tenant-2' }],
      isLoading: false,
    });
  });

  it('should render the tile with correct title', () => {
    // Act
    render(<ServiceLinks />);

    // Assert
    expect(screen.getByText('dashboard.links.title')).toBeInTheDocument();
  });

  it('should render tenants count when data is loaded', () => {
    // Act
    render(<ServiceLinks />);

    // Assert
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render skeletons when loading', () => {
    // Arrange
    mockUseTenants.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    // Act
    render(<ServiceLinks />);

    // Assert
    expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
  });

  it('should render link to tenants page', () => {
    // Act
    render(<ServiceLinks />);

    // Assert
    const link = screen.getByTestId('tile-link');
    expect(link).toBeInTheDocument();
    expect(mockUseHref).toHaveBeenCalled();
  });

  it('should render coming soon badges for datastreams and managed dashboards', () => {
    // Act
    render(<ServiceLinks />);

    // Assert
    const badges = screen.getAllByTestId('badge');
    expect(badges).toHaveLength(2);
    badges.forEach((badge) => {
      expect(badge).toHaveTextContent('shared:coming_soon');
    });
  });

  it('should call useTenants with selected service id', () => {
    // Act
    render(<ServiceLinks />);

    // Assert
    expect(mockUseTenants).toHaveBeenCalledWith('service-123');
  });

  it('should handle missing selected service', () => {
    // Arrange
    mockUseObservabilityServiceContext.mockReturnValue({
      selectedService: undefined,
    });

    // Act
    render(<ServiceLinks />);

    // Assert
    expect(mockUseTenants).toHaveBeenCalledWith('');
  });

  it('should display 0 tenants when data is empty', () => {
    // Arrange
    mockUseTenants.mockReturnValue({
      data: [],
      isLoading: false,
    });

    // Act
    render(<ServiceLinks />);

    // Assert
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
