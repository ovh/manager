import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import RegionsSelect from './RegionSelect.component';
import {
  mockedCapabilitiesRegionGRA,
  mockedCapabilitiesRegionBHS,
} from '@/__tests__/helpers/mocks/capabilities/region';

describe('Region component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onChange = vi.fn();
  it('should display Region Select component', async () => {
    render(
      <RegionsSelect
        regions={[mockedCapabilitiesRegionGRA, mockedCapabilitiesRegionBHS]}
        value={mockedCapabilitiesRegionGRA.id}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('regions-select-container')).toBeTruthy();
      expect(
        screen.getByTestId(
          `region-tile-radio-tile-${mockedCapabilitiesRegionGRA.id}`,
        ),
      ).toBeTruthy();
      expect(
        screen.getByTestId(
          `region-tile-radio-tile-${mockedCapabilitiesRegionBHS.id}`,
        ),
      ).toBeTruthy();
    });
  });
  it('should trigger callback when selected', async () => {
    render(
      <RegionsSelect
        regions={[mockedCapabilitiesRegionGRA, mockedCapabilitiesRegionBHS]}
        value={mockedCapabilitiesRegionGRA.id}
        onChange={onChange}
      />,
    );
    const regionDataTestId = `region-tile-radio-tile-${mockedCapabilitiesRegionBHS.id}`;
    await waitFor(() => {
      expect(screen.getByTestId(regionDataTestId)).toBeTruthy();
    });
    act(() => {
      fireEvent.click(screen.getByTestId(regionDataTestId));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(mockedCapabilitiesRegionBHS.id);
    });
  });
});
