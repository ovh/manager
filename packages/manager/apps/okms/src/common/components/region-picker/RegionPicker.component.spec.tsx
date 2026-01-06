import { useNotificationAddErrorOnce } from '@key-management-service/hooks/useNotificationAddErrorOnce';
import { useRegionName } from '@key-management-service/hooks/useRegionName';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RADIO_CARD_TEST_IDS } from '@/common/components/radio-card/RadioCard.constants';
import { useLocations } from '@/common/data/hooks/useLocation';
import { useOrderCatalogOkms } from '@/common/data/hooks/useOrderCatalogOkms';
import { useReferenceRegions } from '@/common/data/hooks/useReferenceRegions';
import {
  REGION_EU_WEST_GRA,
  REGION_EU_WEST_RBX,
  REGION_EU_WEST_SBG,
  catalogMock,
} from '@/common/mocks/catalog/catalog.mock';
import {
  LOCATION_CA_EAST_BHS,
  LOCATION_CA_EAST_TOR,
  LOCATION_EU_WEST_RBX,
  LOCATION_EU_WEST_SBG,
  locationsMock,
} from '@/common/mocks/locations/locations.mock';
import { referenceRegionsMock } from '@/common/mocks/reference-regions/referenceRegions.mock';
import { OkmsCatalog } from '@/common/types/orderCatalogOkms.type';
import { CONTINENT_CODES } from '@/common/utils/location/continents';

import { RegionPicker } from './RegionPicker.component';
import { REGION_PICKER_TEST_IDS } from './regionPicker.constants';

// Mock hooks
vi.mock('@key-management-service/hooks/useNotificationAddErrorOnce', () => ({
  useNotificationAddErrorOnce: vi.fn(),
}));

vi.mock('@key-management-service/hooks/useRegionName', () => ({
  useRegionName: vi.fn(),
}));

vi.mock('@/common/data/hooks/useLocation', () => ({
  useLocations: vi.fn(),
}));

vi.mock('@/common/data/hooks/useOrderCatalogOkms', () => ({
  useOrderCatalogOkms: vi.fn(),
}));

vi.mock('@/common/data/hooks/useReferenceRegions', () => ({
  useReferenceRegions: vi.fn(),
}));

const mockUseNotificationAddErrorOnce = vi.mocked(useNotificationAddErrorOnce);
const mockUseRegionName = vi.mocked(useRegionName);
const mockUseLocations = vi.mocked(useLocations);
const mockUseOrderCatalogOkms = vi.mocked(useOrderCatalogOkms);
const mockUseReferenceRegions = vi.mocked(useReferenceRegions);

describe('RegionPicker', () => {
  const mockSetSelectedRegion = vi.fn();
  const mockTranslateRegionName = vi.fn((name: string) => `Translated ${name}`);
  const mockTranslateGeographyName = vi.fn((continent: string) => continent);

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    mockUseNotificationAddErrorOnce.mockImplementation(() => {});
    mockUseRegionName.mockReturnValue({
      translateRegionName: mockTranslateRegionName,
      translateGeographyName: mockTranslateGeographyName,
    });

    // Default successful state
    mockUseLocations.mockReturnValue({
      data: locationsMock,
      isPending: false,
      error: null,
    } as ReturnType<typeof useLocations>);

    mockUseOrderCatalogOkms.mockReturnValue({
      data: catalogMock,
      isPending: false,
      error: null,
    } as ReturnType<typeof useOrderCatalogOkms>);

    mockUseReferenceRegions.mockReturnValue({
      data: referenceRegionsMock,
      isPending: false,
      error: null,
    } as unknown as ReturnType<typeof useReferenceRegions>);
  });

  describe('Loading state', () => {
    it('should display a spinner when locations are loading', () => {
      mockUseLocations.mockReturnValue({
        data: undefined,
        isPending: true,
        error: null,
      } as unknown as ReturnType<typeof useLocations>);

      render(<RegionPicker selectedRegion={undefined} setSelectedRegion={mockSetSelectedRegion} />);

      expect(screen.getByTestId(REGION_PICKER_TEST_IDS.SPINNER)).toBeInTheDocument();
    });

    it('should display a spinner when catalog is loading', () => {
      mockUseOrderCatalogOkms.mockReturnValue({
        data: undefined,
        isPending: true,
        error: null,
      } as unknown as ReturnType<typeof useOrderCatalogOkms>);

      render(<RegionPicker selectedRegion={undefined} setSelectedRegion={mockSetSelectedRegion} />);

      expect(screen.getByTestId(REGION_PICKER_TEST_IDS.SPINNER)).toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('should call useNotificationAddErrorOnce when locations fetch fails', () => {
      const mockError = new Error('Failed to fetch locations');
      mockUseLocations.mockReturnValue({
        data: undefined,
        isPending: false,
        error: mockError,
      } as unknown as ReturnType<typeof useLocations>);

      render(<RegionPicker selectedRegion={undefined} setSelectedRegion={mockSetSelectedRegion} />);

      expect(mockUseNotificationAddErrorOnce).toHaveBeenCalledWith(mockError);
    });

    it('should call useNotificationAddErrorOnce when catalog fetch fails', () => {
      const mockError = new Error('Failed to fetch catalog');
      mockUseOrderCatalogOkms.mockReturnValue({
        data: undefined,
        isPending: false,
        error: mockError,
      } as unknown as ReturnType<typeof useOrderCatalogOkms>);

      render(<RegionPicker selectedRegion={undefined} setSelectedRegion={mockSetSelectedRegion} />);

      expect(mockUseNotificationAddErrorOnce).toHaveBeenCalledWith(mockError);
    });

    it('should return null when there is an error', () => {
      const mockError = new Error('Failed to fetch');
      mockUseLocations.mockReturnValue({
        data: undefined,
        isPending: false,
        error: mockError,
      } as unknown as ReturnType<typeof useLocations>);

      const { container } = render(
        <RegionPicker selectedRegion={undefined} setSelectedRegion={mockSetSelectedRegion} />,
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Continent tabs', () => {
    it('should display continent tabs for available continents', async () => {
      mockUseLocations.mockReturnValue({
        data: locationsMock,
        isPending: false,
        error: null,
      } as ReturnType<typeof useLocations>);

      render(<RegionPicker selectedRegion={undefined} setSelectedRegion={mockSetSelectedRegion} />);

      await waitFor(() => {
        // Catalog only includes EUROPE and NORTH_AMERICA
        expect(screen.getByTestId(CONTINENT_CODES.EUROPE)).toBeInTheDocument();
        expect(screen.getByTestId(CONTINENT_CODES.NORTH_AMERICA)).toBeInTheDocument();
        expect(screen.queryByTestId(CONTINENT_CODES.ASIA)).not.toBeInTheDocument();
        expect(screen.queryByTestId(CONTINENT_CODES.AFRICA)).not.toBeInTheDocument();
        expect(screen.queryByTestId(CONTINENT_CODES.OTHERS)).not.toBeInTheDocument();
      });
    });
  });

  describe('Region filtering by continent', () => {
    const catalogMockWithRegions: OkmsCatalog = {
      ...catalogMock,
      plans: [
        {
          ...catalogMock.plans[0]!,
          configurations: [
            {
              ...catalogMock.plans[0]!.configurations[0]!,
              values: [
                LOCATION_EU_WEST_RBX.name,
                LOCATION_EU_WEST_SBG.name,
                LOCATION_CA_EAST_BHS.name,
                LOCATION_CA_EAST_TOR.name,
              ],
            },
          ],
        },
      ],
    };

    it('should display only regions from the selected continent', async () => {
      const user = userEvent.setup();

      mockUseOrderCatalogOkms.mockReturnValue({
        data: catalogMockWithRegions,
        isPending: false,
        error: null,
      } as ReturnType<typeof useOrderCatalogOkms>);

      mockUseLocations.mockReturnValue({
        data: locationsMock,
        isPending: false,
        error: null,
      } as ReturnType<typeof useLocations>);

      render(<RegionPicker selectedRegion={undefined} setSelectedRegion={mockSetSelectedRegion} />);

      // Wait for initial render with EUROPE selected
      await waitFor(() => {
        expect(screen.getByTestId(CONTINENT_CODES.EUROPE)).toBeInTheDocument();
        expect(screen.getByTestId(CONTINENT_CODES.NORTH_AMERICA)).toBeInTheDocument();
      });

      // Verify EUROPE regions are displayed initially
      expect(screen.getByText(`Translated ${LOCATION_EU_WEST_RBX.name}`)).toBeInTheDocument();
      expect(screen.getByText(`Translated ${LOCATION_EU_WEST_SBG.name}`)).toBeInTheDocument();
      // NORTH_AMERICA regions should not be visible
      expect(screen.queryByText(`Translated ${LOCATION_CA_EAST_BHS.name}`)).not.toBeInTheDocument();
      expect(screen.queryByText(`Translated ${LOCATION_CA_EAST_TOR.name}`)).not.toBeInTheDocument();

      // Click on NORTH_AMERICA tab
      const northAmericaTab = screen.getByTestId(CONTINENT_CODES.NORTH_AMERICA);
      await act(async () => {
        await user.click(northAmericaTab);
      });

      // Verify NORTH_AMERICA regions are now displayed
      await waitFor(() => {
        expect(screen.getByText(`Translated ${LOCATION_CA_EAST_BHS.name}`)).toBeInTheDocument();
        expect(screen.getByText(`Translated ${LOCATION_CA_EAST_TOR.name}`)).toBeInTheDocument();
      });

      // EUROPE regions should no longer be visible
      expect(screen.queryByText(`Translated ${LOCATION_EU_WEST_RBX.name}`)).not.toBeInTheDocument();
      expect(screen.queryByText(`Translated ${LOCATION_EU_WEST_SBG.name}`)).not.toBeInTheDocument();
    });
  });

  describe('display certifications', () => {
    const mockLabelPciDss = 'PCI-DSS';
    const mockLabelIso666 = 'ISO-666';

    it('should display one certification', async () => {
      render(<RegionPicker selectedRegion={undefined} setSelectedRegion={mockSetSelectedRegion} />);

      await waitFor(() => {
        const testId = RADIO_CARD_TEST_IDS.card(REGION_EU_WEST_RBX);
        const regionCard = screen.getByTestId(testId);
        expect(regionCard).toBeInTheDocument();

        // Query for ods-badge elements within the region card
        const badges = regionCard.querySelectorAll('ods-badge');
        const badgeLabels = Array.from(badges).map((badge) => badge.getAttribute('label'));

        expect(badgeLabels).toContain(mockLabelPciDss);
        expect(badgeLabels).not.toContain(mockLabelIso666);
      });
    });

    it('should display multiple certifications', async () => {
      render(<RegionPicker selectedRegion={undefined} setSelectedRegion={mockSetSelectedRegion} />);

      await waitFor(() => {
        const testId = RADIO_CARD_TEST_IDS.card(REGION_EU_WEST_SBG);
        const regionCard = screen.getByTestId(testId);
        expect(regionCard).toBeInTheDocument();

        // Query for ods-badge elements within the region card
        const badges = regionCard.querySelectorAll('ods-badge');
        const badgeLabels = Array.from(badges).map((badge) => badge.getAttribute('label'));

        expect(badgeLabels).toContain(mockLabelPciDss);
        expect(badgeLabels).toContain(mockLabelIso666);
      });
    });

    it('should display nothing when there are no certifications', async () => {
      render(<RegionPicker selectedRegion={undefined} setSelectedRegion={mockSetSelectedRegion} />);

      await waitFor(() => {
        const testId = RADIO_CARD_TEST_IDS.card(REGION_EU_WEST_GRA);
        const regionCard = screen.getByTestId(testId);
        expect(regionCard).toBeInTheDocument();

        // Query for ods-badge elements within the region card
        // Note: There might be other badges (like region type badge), so we filter for certification badges
        const badges = regionCard.querySelectorAll('ods-badge');
        const badgeLabels = Array.from(badges).map((badge) => badge.getAttribute('label'));

        expect(badgeLabels).not.toContain(mockLabelPciDss);
        expect(badgeLabels).not.toContain(mockLabelIso666);
      });
    });
  });
});
