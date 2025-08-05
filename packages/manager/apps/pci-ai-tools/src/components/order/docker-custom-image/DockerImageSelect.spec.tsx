import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import DockerCustomImageInput from './DockerCutomImage';
import {
  mockedPresetImage,
  mockedPresetImageBis,
} from '@/__tests__/helpers/mocks/job/presetImage';

describe('Docker custom image component', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.mock('@/hooks/useLocale', () => {
      return {
        useLocale: vi.fn(() => 'fr_FR'),
      };
    });
  });

  const onChange = vi.fn();

  it('should display docker customer image', async () => {
    render(
      <DockerCustomImageInput
        value={''}
        onChange={onChange}
        jobImages={[mockedPresetImage, mockedPresetImageBis]}
      />,
    );
    expect(screen.getByTestId('docker-custom-image')).toBeTruthy();
    expect(screen.getByTestId('docker-custom-image-input')).toBeTruthy();
    expect(screen.getByTestId('docker-custom-image-add-button')).toBeTruthy();
  });

  it('should trigger on Change on trigger add cutom image', async () => {
    render(
      <DockerCustomImageInput
        value={''}
        onChange={onChange}
        jobImages={[mockedPresetImage, mockedPresetImageBis]}
      />,
    );
    const customerImage = 'my personnal image';
    act(() => {
      fireEvent.change(screen.getByTestId('docker-custom-image-input'), {
        target: {
          value: customerImage,
        },
      });
      fireEvent.click(screen.getByTestId('docker-custom-image-add-button'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(customerImage);
    });
  });
});
