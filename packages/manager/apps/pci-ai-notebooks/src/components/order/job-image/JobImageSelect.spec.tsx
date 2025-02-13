import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi } from 'vitest';
import ImagesSelect from './JobImageSelect.component';
import {
  mockedPresetImage,
  mockedPresetImageBis,
} from '@/__tests__/helpers/mocks/presetImage';

describe('Docker Image Select component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onChange = vi.fn();
  it('should display Docker Image component with ovh image tile', async () => {
    render(
      <ImagesSelect
        images={[mockedPresetImage, mockedPresetImageBis]}
        value={''}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('ovh-image-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('custom-image-trigger')).toBeInTheDocument();
      expect(
        screen.getByTestId(`image-radio-tile-${mockedPresetImage.id}`),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('personnal-image-input'),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('image-add-button')).not.toBeInTheDocument();
    });
  });

  it('should trigger callback when selected an ovh image', async () => {
    render(
      <ImagesSelect
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

  it('should display personnal image input on custom image trigger and trigger callback', async () => {
    render(
      <ImagesSelect
        images={[mockedPresetImage, mockedPresetImageBis]}
        value={''}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByTestId('custom-image-trigger'));

    await waitFor(() => {
      expect(
        screen.queryByTestId(`image-radio-tile-${mockedPresetImage.id}`),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('personnal-image-input')).toBeInTheDocument();
      expect(screen.getByTestId('image-add-button')).toBeInTheDocument();
    });

    const customerImage = 'my personnal image';
    act(() => {
      fireEvent.change(screen.getByTestId('personnal-image-input'), {
        target: {
          value: customerImage,
        },
      });
      fireEvent.click(screen.getByTestId('image-add-button'));
    });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(customerImage);
    });
  });
});
