import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import {
  useFeatureAvailability,
  UseFeatureAvailabilityResult,
} from '@ovh-ux/manager-react-components';
import {
  FEATURE_REGION_1AZ,
  RegionGlobalzoneChip,
} from './RegionGlobalzoneChip.component';
import { wrapper } from '@/wrapperRenders';
import { URL_INFO } from '@/components/region-selector/constants';
import { useHas3AZ } from '@/hooks/useHas3AZ/useHas3AZ';

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const module = await importOriginal<
    typeof import('@ovh-ux/manager-react-components')
  >();
  return { ...module, useFeatureAvailability: vi.fn() };
});

vi.mock('@/hooks/useHas3AZ/useHas3AZ');

enum ExpectedType {
  GLOBAL_REGIONS = 'GLOBAL_REGIONS',
  '1AZ_REGIONS' = '1AZ_REGIONS',
}

const EXPECTED_VALUES = {
  [ExpectedType.GLOBAL_REGIONS]: {
    label: 'pci_project_flavors_zone_global_region',
    tooltip: 'pci_project_flavors_zone_globalregions_tooltip',
    link: URL_INFO.GLOBAL_REGIONS.DEFAULT,
  },
  [ExpectedType['1AZ_REGIONS']]: {
    label: 'pci_project_flavors_zone_1AZ',
    tooltip: 'pci_project_flavors_zone_1AZ_tooltip',
    link: URL_INFO['1AZ_REGIONS'].DEFAULT,
  },
};

describe('RegionGlobalzoneChip', () => {
  it.each([
    [undefined, undefined, ExpectedType.GLOBAL_REGIONS],
    [undefined, false, ExpectedType.GLOBAL_REGIONS],
    [undefined, true, ExpectedType['1AZ_REGIONS']],
    [false, undefined, ExpectedType.GLOBAL_REGIONS],
    [false, false, ExpectedType.GLOBAL_REGIONS],
    [false, true, ExpectedType['1AZ_REGIONS']],
    [true, undefined, ExpectedType.GLOBAL_REGIONS],
    [true, false, ExpectedType.GLOBAL_REGIONS],
    [true, true, ExpectedType['1AZ_REGIONS']],
  ])(
    'should render chip with showTooltip %s show1AZ %s with correct texts and links',
    (
      showTooltip: boolean | undefined,
      show1AZ: boolean | undefined,
      expectedType,
    ) => {
      const expected = EXPECTED_VALUES[expectedType];

      vi.mocked(useFeatureAvailability).mockImplementationOnce(
        (features) =>
          ({
            data: {
              ...Object.fromEntries(
                features.map((feature) => [feature, false]),
              ),
              [FEATURE_REGION_1AZ]: show1AZ,
            },
            isLoading: false,
          } as UseFeatureAvailabilityResult),
      );

      render(<RegionGlobalzoneChip showTooltip={showTooltip} />, { wrapper });

      expect(screen.getByText(expected.label)).toBeInTheDocument();

      if (showTooltip ?? true) {
        expect(screen.getByText(expected.tooltip)).toBeInTheDocument();

        const link = screen.getByText('pci_project_flavors_zone_tooltip_link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', expected.link);
      } else {
        expect(screen.queryByText(expected.tooltip)).not.toBeInTheDocument();
        expect(
          screen.queryByText('pci_project_flavors_zone_tooltip_link'),
        ).not.toBeInTheDocument();
      }
    },
  );

  it.each([
    ['render', true, true],
    ['not render', true, undefined],
    ['not render', false, true],
  ])(
    'should %s 3AZ tooltip text when feature availability is %s and 3AZ availability is %s',
    (expected: string, show1AZ: boolean, has3AZ: boolean) => {
      vi.mocked(useFeatureAvailability).mockImplementationOnce(
        (features) =>
          ({
            data: {
              ...Object.fromEntries(
                features.map((feature) => [feature, false]),
              ),
              [FEATURE_REGION_1AZ]: show1AZ,
            },
            isLoading: false,
          } as UseFeatureAvailabilityResult),
      );

      vi.mocked(useHas3AZ).mockReturnValue(has3AZ);

      render(<RegionGlobalzoneChip />, { wrapper });

      if (expected === 'render') {
        expect(
          screen.getByText('pci_project_flavors_zone_1AZ_with_3AZ_tooltip'),
        ).toBeInTheDocument();
      } else {
        expect(
          screen.queryByText('pci_project_flavors_zone_1AZ_with_3AZ_tooltip'),
        ).not.toBeInTheDocument();
      }
    },
  );
});
