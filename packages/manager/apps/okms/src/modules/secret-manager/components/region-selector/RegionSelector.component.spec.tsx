import { BrowserRouter } from 'react-router-dom';

import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  LOCATION_CA_EAST_BHS,
  LOCATION_EU_WEST_GRA,
  LOCATION_EU_WEST_LIM,
} from '@/common/mocks/locations/locations.mock';
import { CONTINENT_CODES } from '@/common/utils/location/continents';
import { initTestI18n, labels } from '@/common/utils/tests/init.i18n';
import { getOdsButtonByIcon, getOdsButtonByLabel } from '@/common/utils/tests/uiTestHelpers';
import {
  GeographyGroup,
  useRegionSelector,
} from '@/modules/secret-manager/hooks/useRegionSelector';

import { RegionSelector } from './RegionSelector.component';

let i18nValue: i18n;

// Mock the useRegionSelector hook
vi.mock('@/modules/secret-manager/hooks/useRegionSelector', () => ({
  useRegionSelector: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => vi.fn(),
    useHref: vi.fn((link: string) => link),
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
  GRA: labels.common.region['region_eu-west-gra'],
  DE: labels.common.region['region_eu-west-lim'],
  BHS: labels.common.region['region_ca-east-bhs'],
};

const mockGeographyNames = {
  EU: labels.commonOkms.region_continent_EUROPE,
  CA: labels.commonOkms.region_continent_NORTH_AMERICA,
};

const mockGeographyGroups: GeographyGroup[] = [
  {
    continentCode: CONTINENT_CODES.EUROPE,
    regions: [
      {
        region: LOCATION_EU_WEST_GRA.name,
        continentCode: CONTINENT_CODES.EUROPE,
        href: SECRET_MANAGER_ROUTES_URLS.okmsList(LOCATION_EU_WEST_GRA.name),
      },
      {
        region: LOCATION_EU_WEST_LIM.name,
        continentCode: CONTINENT_CODES.EUROPE,
        href: SECRET_MANAGER_ROUTES_URLS.okmsList(LOCATION_EU_WEST_LIM.name),
      },
    ],
  },
  {
    continentCode: CONTINENT_CODES.NORTH_AMERICA,
    regions: [
      {
        region: LOCATION_CA_EAST_BHS.name,
        continentCode: CONTINENT_CODES.NORTH_AMERICA,
        href: SECRET_MANAGER_ROUTES_URLS.okmsList(LOCATION_CA_EAST_BHS.name),
      },
    ],
  },
];

const mockCurrentRegion = mockGeographyGroups[0]?.regions?.find(
  (region) => region.region === LOCATION_EU_WEST_GRA.name,
);

describe('RegionSelector Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should display loading state when isLoading is true', async () => {
      // Given
      vi.mocked(useRegionSelector).mockReturnValue({
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
      vi.mocked(useRegionSelector).mockReturnValue({
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
      vi.mocked(useRegionSelector).mockReturnValue({
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
      expect(screen.getByText(labels.common.region.region)).toBeInTheDocument();
      await getOdsButtonByLabel({
        container,
        label: mockRegionLabels.GRA,
      });
    });

    it('should display all geography groups in the popover', async () => {
      // When
      const { container } = await renderRegionSelector();

      // Then
      expect(screen.getByText(mockGeographyNames.EU)).toBeInTheDocument();
      expect(screen.getByText(mockGeographyNames.CA)).toBeInTheDocument();

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
      expect(current).toHaveClass('[&::part(link)]:text-[var(--ods-color-heading)]');

      const notCurrent = await getOdsButtonByLabel({
        container,
        label: mockRegionLabels.DE,
        isLink: true,
      });
      expect(notCurrent).toHaveClass('[&::part(link)]:text-[var(--ods-color-primary-500)]');
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
      vi.mocked(useRegionSelector).mockReturnValue({
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
