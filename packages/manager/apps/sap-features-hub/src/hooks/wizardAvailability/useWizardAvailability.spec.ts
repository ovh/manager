import { renderHook } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import {
  useFeatureAvailability,
  UseFeatureAvailabilityResult,
} from '@ovh-ux/manager-react-components';
import { FEATURES } from '@/utils/features.constants';
import { useWizardAvailability } from './useWizardAvailability';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useFeatureAvailability: vi.fn(),
}));

describe('useWizardAvailability test suite', () => {
  it('returns isWizardAvailable as true when feature is available', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: { [FEATURES.INSTALLATION_WIZARD]: true },
      isLoading: false,
    } as UseFeatureAvailabilityResult);

    const { result } = renderHook(() => useWizardAvailability());
    expect(result.current.isWizardAvailable).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns isWizardAvailable as false when feature is not available', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: { [FEATURES.INSTALLATION_WIZARD]: false },
      isLoading: false,
    } as UseFeatureAvailabilityResult);

    const { result } = renderHook(() => useWizardAvailability());
    expect(result.current.isWizardAvailable).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns isLoading as true when query is still pending', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as UseFeatureAvailabilityResult);

    const { result } = renderHook(() => useWizardAvailability());
    expect(result.current.isLoading).toBe(true);
  });
});
