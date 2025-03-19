import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import { KubeRegionSelector } from './KubeRegionSelector.component';
import { mockedModule } from '@/mocks/mockAvaibility';
import useHas3AZRegions from '@/hooks/useHas3AZRegions';
import use3AZPlanAvailable from '@/hooks/use3azPlanAvaible';
import { RegionType } from '@/pages/new/steps/LocationStep.component';
import { wrapper } from '@/wrapperRenders';

vi.mock('@/mocks/mockAvaibility', () => ({
  mockedModule: {
    useProductAvailability: vi.fn(),
  },
}));

vi.mock('@/hooks/useHas3AZRegions', () => ({
  default: vi.fn(),
}));

vi.mock('@/hooks/use3azPlanAvaible', () => ({
  default: vi.fn(),
}));

describe('KubeRegionSelector', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useHas3AZRegions).mockReturnValue({
      contains3AZ: true,
      uniqueRegions: [RegionType.Region],
    });
  });
  it('renders the spinner when data is loading', () => {
    vi.mocked(mockedModule.useProductAvailability as Mock).mockReturnValue({
      data: null,
      isPending: true,
    });
    vi.mocked(use3AZPlanAvailable).mockReturnValue(false);

    render(
      <KubeRegionSelector
        projectId="test"
        onSelectRegion={() => {}}
        selectedDeployment="region-type"
      />,
      { wrapper },
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders the RegionSelector when data is available', () => {
    vi.mocked(mockedModule.useProductAvailability as Mock).mockReturnValue({
      data: {
        products: [
          {
            name: 'kubernetes',
            regions: [
              {
                name: 'EU-WEST-PAR',
                datacenter: 'WAW',
                continentCode: 'EU',
                enabled: true,
                type: RegionType.Region3Az,
                availabilityZones: [
                  'eu-west-par-a',
                  'eu-west-par-b',
                  'eu-west-par-c',
                ],
              },
            ],
          },
        ],
      },
      isPending: false,
    });
    vi.mocked(use3AZPlanAvailable).mockReturnValue(true);

    render(
      <KubeRegionSelector
        projectId="test"
        onSelectRegion={() => {}}
        selectedDeployment="region-type"
      />,
      { wrapper },
    );

    expect(screen.getByTestId('region-selector')).toBeInTheDocument();
  });
});
