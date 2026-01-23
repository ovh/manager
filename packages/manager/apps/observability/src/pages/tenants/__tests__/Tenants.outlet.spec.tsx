import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import TenantsOutlet from '@/pages/tenants/Tenants.outlet';
import { urls } from '@/routes/Routes.constants';

// Mock ServicesNavigation component
vi.mock('@/components/services/navigation/ServicesNavigation.component', () => ({
  default: ({ button, rootUrl }: { button?: React.ReactNode; rootUrl: string }) => (
    <div data-testid="services-navigation" data-root-url={rootUrl}>
      {button && <div data-testid="button-slot">{button}</div>}
    </div>
  ),
}));

// Mock GrafanaButton component
vi.mock('@/components/metrics/grafana-button/GrafanaButton.component', () => ({
  default: () => <button data-testid="grafana-button">Grafana Button</button>,
}));

describe('TenantsOutlet', () => {
  describe('Component Rendering', () => {
    it('should render ServicesNavigation component', () => {
      // Act
      render(<TenantsOutlet />);

      // Assert
      expect(screen.getByTestId('services-navigation')).toBeInTheDocument();
    });

    it('should pass GrafanaButton as button prop', () => {
      // Act
      render(<TenantsOutlet />);

      // Assert
      expect(screen.getByTestId('button-slot')).toBeInTheDocument();
      expect(screen.getByTestId('grafana-button')).toBeInTheDocument();
    });

    it('should pass correct rootUrl prop', () => {
      // Act
      render(<TenantsOutlet />);

      // Assert
      const navigation = screen.getByTestId('services-navigation');
      expect(navigation).toHaveAttribute('data-root-url', urls.tenants);
    });
  });
});
