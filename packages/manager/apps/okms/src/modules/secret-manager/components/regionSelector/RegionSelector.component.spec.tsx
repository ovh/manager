import React from 'react';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import {
  getOdsButtonByLabel,
  getOdsButtonByIcon,
} from '@/utils/tests/uiTestHelpers';
import { initTestI18n } from '@/utils/tests/init.i18n';
import {
  GeographyGroup,
  RegionOption,
} from '@/modules/secret-manager/hooks/useRegionSelector';
import { RegionSelector } from './RegionSelector.component';

let i18nValue: i18n;

// Mock the useRegionSelector hook
const mockUseRegionSelector = vi.fn();
vi.mock('@/modules/secret-manager/hooks/useRegionSelector', () => ({
  useRegionSelector: () => mockUseRegionSelector(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => vi.fn(),
    useHref: vi.fn((link) => link),
  };
});

const renderRegionSelector = async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18nValue}>
        <QueryClientProvider client={queryClient}>
          <RegionSelector />
        </QueryClientProvider>
      </I18nextProvider>
    </BrowserRouter>,
  );
};

const mockRegionLabels = {
  GRA: 'France (Gravelines)',
  DE: 'Germany (Frankfurt)',
  BHS: 'Canada (Beauharnois)',
};

const mockGeographyGroups: GeographyGroup[] = [
  {
    geographyLabel: 'Europe',
    regions: [
      {
        label: mockRegionLabels.GRA,
        region: 'GRA',
        geographyLabel: 'Europe',
        href: SECRET_MANAGER_ROUTES_URLS.secretDomains('GRA'),
      },
      {
        label: mockRegionLabels.DE,
        region: 'DE',
        geographyLabel: 'Europe',
        href: SECRET_MANAGER_ROUTES_URLS.secretDomains('DE'),
      },
    ],
  },
  {
    geographyLabel: 'North America',
    regions: [
      {
        label: mockRegionLabels.BHS,
        region: 'BHS',
        geographyLabel: 'North America',
        href: SECRET_MANAGER_ROUTES_URLS.secretDomains('BHS'),
      },
    ],
  },
];

const mockCurrentRegion = mockGeographyGroups[0].regions.find(
  (region) => region.region === 'GRA',
) as RegionOption;

describe('RegionSelector Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should display loading state when isLoading is true', async () => {
      // Given
      mockUseRegionSelector.mockReturnValue({
        geographyGroups: [],
        currentRegion: undefined,
        isLoading: true,
        isError: false,
      });

      // When
      const { container } = await renderRegionSelector();

      // Then
      const button = await getOdsButtonByIcon({
        container,
        iconName: 'chevron-down',
      });

      expect(button).toHaveAttribute('is-loading', 'true');
    });
  });

  describe('Error state', () => {
    it('should render nothing when isError is true', async () => {
      // Given
      mockUseRegionSelector.mockReturnValue({
        geographyGroups: [],
        currentRegion: undefined,
        isLoading: false,
        isError: true,
      });

      // When
      const { container } = await renderRegionSelector();

      // Then
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Normal state', () => {
    beforeEach(() => {
      mockUseRegionSelector.mockReturnValue({
        geographyGroups: mockGeographyGroups,
        currentRegion: mockCurrentRegion,
        isLoading: false,
        isError: false,
      });
    });

    it('should render the region selector with current region', async () => {
      // When
      const { container } = await renderRegionSelector();

      // Then
      expect(screen.getByText('region')).toBeInTheDocument();
      await getOdsButtonByLabel({ container, label: mockCurrentRegion.label });
    });

    it('should display all geography groups in the popover', async () => {
      // When
      const { container } = await renderRegionSelector();

      // Then
      expect(screen.getByText('Europe')).toBeInTheDocument();
      expect(screen.getByText('North America')).toBeInTheDocument();

      // Check region links
      await getOdsButtonByLabel({
        container,
        label: mockRegionLabels.GRA,
        isLink: true,
      });
      await getOdsButtonByLabel({
        container,
        label: mockRegionLabels.DE,
        isLink: true,
      });
      await getOdsButtonByLabel({
        container,
        label: mockRegionLabels.BHS,
        isLink: true,
      });
    });

    it('should highlight the link for the current region', async () => {
      // When
      const { container } = await renderRegionSelector();

      // Then
      const current = await getOdsButtonByLabel({
        container,
        label: mockRegionLabels.GRA,
        isLink: true,
      });
      expect(current).toHaveClass(
        '[&::part(link)]:text-[var(--ods-color-heading)]',
      );

      const notCurrent = await getOdsButtonByLabel({
        container,
        label: mockRegionLabels.DE,
        isLink: true,
      });
      expect(notCurrent).toHaveClass(
        '[&::part(link)]:text-[var(--ods-color-primary-500)]',
      );
    });

    it('should display dividers between geography groups', async () => {
      // When
      await renderRegionSelector();

      // Then
      await waitFor(() => {
        const dividers = document.querySelectorAll('ods-divider');
        // Should have 1 divider between 2 geography groups
        expect(dividers).toHaveLength(1);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty geography groups', async () => {
      // Given
      mockUseRegionSelector.mockReturnValue({
        geographyGroups: [],
        currentRegion: undefined,
        isLoading: false,
        isError: false,
      });

      // When
      const { container } = await renderRegionSelector();

      // Then
      const button = await getOdsButtonByIcon({
        container,
        iconName: 'chevron-down',
      });

      expect(button).toHaveAttribute('label', '');
    });
  });
});
