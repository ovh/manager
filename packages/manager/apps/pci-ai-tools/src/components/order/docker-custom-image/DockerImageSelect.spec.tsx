import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import DockerCustomImageInput from './DockerCutomImage';

describe('Docker custom image component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onChange = vi.fn();

  it('should display docker customer image', async () => {
    render(<DockerCustomImageInput value={''} onChange={onChange} />);
    expect(screen.getByTestId('docker-custom-image')).toBeInTheDocument();
    expect(screen.getByTestId('docker-custom-image-input')).toBeInTheDocument();
    expect(
      screen.getByTestId('docker-custom-image-add-button'),
    ).toBeInTheDocument();
  });

  it('should trigger on Change on trigger add cutom image', async () => {
    render(<DockerCustomImageInput value={''} onChange={onChange} />);
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
