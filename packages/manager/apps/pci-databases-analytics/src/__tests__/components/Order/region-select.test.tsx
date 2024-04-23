import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import RegionSelect from '@/components/Order/region/region-select';
import {
  mockedOrderFunnelRegion,
  mockedOrderFunnelRegionBis,
} from '@/__tests__/helpers/mocks/order-funnel';

describe('FlavorSelect component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should display the Flavor-Select table', async () => {
    const onChange = vi.fn();

    render(
      <RegionSelect
        regions={[mockedOrderFunnelRegion]}
        onChange={onChange}
        value=""
      />,
    );
    await waitFor(() => {
      const RegionRadioTile = `regions-radio-tile-${mockedOrderFunnelRegion.name}`;
      expect(
        screen.getByTestId('regions-select-container'),
      ).toBeInTheDocument();
      expect(screen.getByTestId(RegionRadioTile)).toBeInTheDocument();
    });
  });

  it('should trigger callback when selected', async () => {
    const onChange = vi.fn();
    render(
      <RegionSelect
        regions={[mockedOrderFunnelRegion]}
        onChange={onChange}
        value=""
      />,
    );
    act(() => {
      const RegionRadioTile = `regions-radio-tile-${mockedOrderFunnelRegion.name}`;
      fireEvent.click(screen.getByTestId(RegionRadioTile));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(mockedOrderFunnelRegion.name);
    });
  });
});
