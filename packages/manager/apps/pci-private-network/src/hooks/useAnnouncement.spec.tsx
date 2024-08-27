import { describe, vi } from 'vitest';
import {
  useFeatureAvailability,
  UseFeatureAvailabilityResult,
} from '@ovh-ux/manager-react-components';
import { renderHook } from '@testing-library/react';
import { pciAnnouncementBannerId } from '@/constants';
import { useAnnouncementBanner } from '@/hooks/useAnnouncement';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useFeatureAvailability: vi.fn(),
}));

describe('useAnnouncementBanner', () => {
  it('should return banner visibility as true when feature is available', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: { [pciAnnouncementBannerId]: true },
      isLoading: false,
    } as UseFeatureAvailabilityResult);

    const { result } = renderHook(() => useAnnouncementBanner());
    expect(result.current.isBannerVisible).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return banner visibility as false when feature is not available', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: { [pciAnnouncementBannerId]: false },
      isLoading: false,
    } as UseFeatureAvailabilityResult);

    const { result } = renderHook(() => useAnnouncementBanner());
    expect(result.current.isBannerVisible).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return isLoading as true when feature availability is loading', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as UseFeatureAvailabilityResult);

    const { result } = renderHook(() => useAnnouncementBanner());
    expect(result.current.isBannerVisible).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
  });
});
