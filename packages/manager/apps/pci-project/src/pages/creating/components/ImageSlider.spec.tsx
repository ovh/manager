import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ImageSlider from './ImageSlider';
import { createWrapper } from '@/wrapperRenders';
import { useImageSlider } from '../hooks/useImageSlider';

vi.mock('../hooks/useImageSlider', () => ({
  useImageSlider: vi.fn(),
}));

describe('ImageSlider', () => {
  const defaultMockReturn = {
    currentImage: '/assets/creating/Hero16-9_Data_ADP.png',
  };

  beforeEach(async () => {
    vi.mocked(useImageSlider).mockReturnValue(defaultMockReturn);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(<ImageSlider />, { wrapper: createWrapper() });

  it('should render image with correct src from hook', () => {
    renderComponent();

    const image = screen.getByRole('img', { name: 'Public Cloud service' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      '/assets/creating/Hero16-9_Data_ADP.png',
    );
    expect(image).toHaveAttribute('alt', 'Public Cloud service');
  });

  it('should call useImageSlider hook', async () => {
    renderComponent();

    expect(useImageSlider).toHaveBeenCalledTimes(1);
    expect(useImageSlider).toHaveBeenCalledWith();
  });

  it('should update image when hook returns different image', async () => {
    const { rerender } = renderComponent();

    let image = screen.getByRole('img', { name: 'Public Cloud service' });
    expect(image).toHaveAttribute(
      'src',
      '/assets/creating/Hero16-9_Data_ADP.png',
    );

    vi.mocked(useImageSlider).mockReturnValue({
      currentImage: '/assets/creating/Hero16-9_Orchestration_Ks8.png',
    });

    rerender(<ImageSlider />);

    image = screen.getByRole('img', { name: 'Public Cloud service' });
    expect(image).toHaveAttribute(
      'src',
      '/assets/creating/Hero16-9_Orchestration_Ks8.png',
    );
  });
});
