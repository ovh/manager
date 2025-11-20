import React from 'react';

import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useImageSlider } from '@/hooks/use-image-slider/useImageSlider';
import { createWrapper } from '@/wrapperRenders';

import ImageSlider from '../ImageSlider';

vi.mock('@/hooks/use-image-slider/useImageSlider', () => ({
  useImageSlider: vi.fn(),
}));

describe('ImageSlider', () => {
  const defaultMockReturn = {
    currentImage: '/assets/creating/Hero16-9_Data_ADP.png',
  };

  beforeEach(() => {
    vi.mocked(useImageSlider).mockReturnValue(defaultMockReturn);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => render(<ImageSlider />, { wrapper: createWrapper() });

  it('should render image with correct src from hook', () => {
    renderComponent();

    const image = screen.getByRole('img', { name: 'Public Cloud service' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/assets/creating/Hero16-9_Data_ADP.png');
    expect(image).toHaveAttribute('alt', 'Public Cloud service');
  });

  it('should call useImageSlider hook', () => {
    renderComponent();

    expect(useImageSlider).toHaveBeenCalledTimes(1);
    expect(useImageSlider).toHaveBeenCalledWith();
  });

  it('should update image when hook returns different image', () => {
    const { rerender } = renderComponent();

    let image = screen.getByRole('img', { name: 'Public Cloud service' });
    expect(image).toHaveAttribute('src', '/assets/creating/Hero16-9_Data_ADP.png');

    vi.mocked(useImageSlider).mockReturnValue({
      currentImage: '/assets/creating/Hero16-9_Orchestration_Ks8.png',
    });

    rerender(<ImageSlider />);

    image = screen.getByRole('img', { name: 'Public Cloud service' });
    expect(image).toHaveAttribute('src', '/assets/creating/Hero16-9_Orchestration_Ks8.png');
  });
});
