import { describe, vi } from 'vitest';
import { render } from '@testing-library/react';
import {
  TRegionAvailability,
  useGetProjectRegions,
} from '@ovh-ux/manager-pci-common';
import { TRegion } from '@ovh-ux/manager-react-components';
import { wrapper } from '@/wrapperRenders';
import { ContainerRegionSelector } from './ContainerRegionSelector.component';

vi.mock('react-use', async () => {
  const mod = await vi.importActual('react-use');
  return {
    ...mod,
    useMedia: () => false,
  };
});

describe('ContainerRegionSelector', () => {
  it('should display correctly', () => {
    const region = ({
      name: 'name',
      available: true,
      countries: ['countries'],
    } as unknown) as TRegionAvailability;
    const regions = [{ name: 'region1', type: 'type1' }] as TRegion[];
    vi.mocked(useGetProjectRegions).mockReturnValue({
      data: regions,
      isLoading: false,
    } as never);
    const { asFragment } = render(
      <ContainerRegionSelector
        deploymentMode="mode"
        offer="offer"
        region={region}
        isSubmitted={false}
        onSelectRegion={vi.fn()}
        isSwiftOffer={false}
      />,
      { wrapper },
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
