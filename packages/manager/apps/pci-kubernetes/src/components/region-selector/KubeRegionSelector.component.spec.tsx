import { UseQueryResult } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  ResponseAPIError,
  TProductAvailability,
  TProject,
  useProductAvailability,
  useProject,
} from '@ovh-ux/manager-pci-common';

import use3AZPlanAvailable from '@/hooks/use3azPlanAvaible';
import useHas3AZRegions from '@/hooks/useHas3AZRegions';
import { RegionType } from '@/pages/new/steps/LocationStep.component';
import { wrapper } from '@/wrapperRenders';

import { KubeRegionSelector } from './KubeRegionSelector.component';

vi.mock('@ovh-ux/manager-pci-common', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-pci-common');
  return {
    ...actual,
    useProductAvailability: vi.fn(),
    useProject: vi.fn(),
  };
});

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
    vi.mocked(useProductAvailability).mockReturnValue({
      data: null,
      isPending: true,
    } as UseQueryResult<TProductAvailability>);
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
    vi.mocked(useProductAvailability).mockReturnValue({
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
                availabilityZones: ['eu-west-par-a', 'eu-west-par-b', 'eu-west-par-c'],
              },
            ],
          },
        ],
      },
      isPending: false,
    } as UseQueryResult<TProductAvailability>);
    vi.mocked(use3AZPlanAvailable).mockReturnValue(true);
    vi.mocked(useProject).mockReturnValue({
      data: { project_id: 'test' },
    } as UseQueryResult<TProject, ResponseAPIError>);
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
