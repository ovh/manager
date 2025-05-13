import { renderHook } from '@testing-library/react';
import {
  UseFeatureAvailabilityResult,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import { describe, it, vi } from 'vitest';
import {
  PCI_ANNOUNCEMENT_BANNER_FEATURE,
  useAnnouncementBanner,
} from './useAnnouncementBanner';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useFeatureAvailability: vi.fn(),
}));

describe('useAnnouncementBanner', () => {
  it('returns isBannerVisible as true when feature is available', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: { [PCI_ANNOUNCEMENT_BANNER_FEATURE]: true },
      isLoading: false,
    } as UseFeatureAvailabilityResult);

    const { result } = renderHook(() => useAnnouncementBanner());
    expect(result.current.isBannerVisible).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns isBannerVisible as false when feature is not available', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: { [PCI_ANNOUNCEMENT_BANNER_FEATURE]: false },
      isLoading: false,
    } as UseFeatureAvailabilityResult);

    const { result } = renderHook(() => useAnnouncementBanner());
    expect(result.current.isBannerVisible).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns isLoading as true when data is not yet available', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as UseFeatureAvailabilityResult);

    const { result } = renderHook(() => useAnnouncementBanner());
    expect(result.current.isLoading).toBe(true);
  });
});
