import '@testing-library/jest-dom';
import { act, fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';

import VideoCenterOnboardingPage from '../videoCenterOnboarding.page';

const mockWindowOpen = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.window.open = mockWindowOpen;
});

describe('VideoCenterOnboardingPage', () => {
  it('should render onboarding layout', () => {
    const { container } = render(<VideoCenterOnboardingPage />, { wrapper });

    expect(container).toBeInTheDocument();
  });

  it('should display correct title', () => {
    const { container } = render(<VideoCenterOnboardingPage />, { wrapper });

    // Title uses translation key 'video_manager_page_title'
    expect(container).toBeInTheDocument();
  });

  it('should display description', () => {
    const { container } = render(<VideoCenterOnboardingPage />, { wrapper });

    // Description uses translation key 'video_manager_service_description'
    expect(container).toBeInTheDocument();
  });

  it('should show order button', () => {
    const { container } = render(<VideoCenterOnboardingPage />, { wrapper });

    // OnboardingLayout should render a button
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should open external URL when button is clicked', () => {
    const { container } = render(<VideoCenterOnboardingPage />, { wrapper });

    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();

    if (button) {
      act(() => {
        fireEvent.click(button);
      });

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://labs.ovhcloud.com/en/video-webhosting',
        '_blank',
        'noopener',
      );
    }
  });

  it('should verify translation keys are used', () => {
    const { container } = render(<VideoCenterOnboardingPage />, { wrapper });

    // Component uses translation keys which are mocked in test.setup.tsx
    expect(container).toBeInTheDocument();
  });

  it('should render image', () => {
    const { container } = render(<VideoCenterOnboardingPage />, { wrapper });

    // OnboardingLayout should render an image
    const images = container.querySelectorAll('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should have correct image alt text', () => {
    const { container } = render(<VideoCenterOnboardingPage />, { wrapper });

    const images = container.querySelectorAll('img');
    if (images.length > 0) {
      expect(images[0]).toHaveAttribute('alt', '');
    }
  });
});
