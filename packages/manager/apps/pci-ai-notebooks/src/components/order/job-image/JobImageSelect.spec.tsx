import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi } from 'vitest';
import {
  mockedPresetImage,
  mockedPresetImageBis,
} from '@/__tests__/helpers/mocks/job/presetImage';
import JobImagesSelect from './JobImageSelect.component';

describe('Docker Image Select component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onChange = vi.fn();
  it('should display Docker Image component with preset image select', async () => {
    render(
      <JobImagesSelect
        images={[mockedPresetImage, mockedPresetImageBis]}
        value={''}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('ovh-image-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('custom-image-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('preset-image-select')).toBeInTheDocument();
      expect(
        screen.queryByTestId('docker-custom-image'),
      ).not.toBeInTheDocument();
    });
  });

  it('should display personnal image input on custom image trigger', async () => {
    render(
      <JobImagesSelect
        images={[mockedPresetImage, mockedPresetImageBis]}
        value={''}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByTestId('custom-image-trigger'));
    await waitFor(() => {
      expect(
        screen.queryByTestId('preset-image-select'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('docker-custom-image')).toBeInTheDocument();
    });
  });
});
