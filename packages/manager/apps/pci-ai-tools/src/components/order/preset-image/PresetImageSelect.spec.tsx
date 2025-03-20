import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import {
  mockedPresetImage,
  mockedPresetImageBis,
} from '@/__tests__/helpers/mocks/job/presetImage';
import PresetImageSelect from './PresetImageSelect.component';

describe('Preset Image Select component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onChange = vi.fn();
  it('should display Preset Image component with ovh image tile', async () => {
    render(
      <PresetImageSelect
        images={[mockedPresetImage, mockedPresetImageBis]}
        value={''}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('preset-image-select')).toBeInTheDocument();
      expect(
        screen.getByTestId(`image-radio-tile-${mockedPresetImage.id}`),
      ).toBeInTheDocument();
    });
  });

  it('should trigger callback when selected an ovh image', async () => {
    render(
      <PresetImageSelect
        images={[mockedPresetImage, mockedPresetImageBis]}
        value={''}
        onChange={onChange}
      />,
    );

    act(() => {
      fireEvent.click(
        screen.getByTestId(`image-radio-tile-${mockedPresetImage.id}`),
      );
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(mockedPresetImage.id);
    });
  });
});
