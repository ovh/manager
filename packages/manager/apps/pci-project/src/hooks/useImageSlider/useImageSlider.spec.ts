import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SLIDE_IMAGES, useImageSlider } from './useImageSlider';
import { SLIDE_ANIMATION_INTERVAL } from '@/constants';

describe('useImageSlider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should return first image initially', () => {
    const { result } = renderHook(() => useImageSlider());

    expect(result.current.currentImage).toBe(SLIDE_IMAGES[0]);
  });

  it('should advance to next image after interval', () => {
    const { result } = renderHook(() => useImageSlider());

    expect(result.current.currentImage).toBe(SLIDE_IMAGES[0]);

    act(() => {
      vi.advanceTimersByTime(SLIDE_ANIMATION_INTERVAL);
    });

    expect(result.current.currentImage).toBe(SLIDE_IMAGES[1]);
  });

  it('should loop back to first image after reaching the end', () => {
    const { result } = renderHook(() => useImageSlider());

    act(() => {
      vi.advanceTimersByTime(
        SLIDE_ANIMATION_INTERVAL * (SLIDE_IMAGES.length - 1),
      );
    });

    expect(result.current.currentImage).toBe(
      SLIDE_IMAGES[SLIDE_IMAGES.length - 1],
    );

    act(() => {
      vi.advanceTimersByTime(SLIDE_ANIMATION_INTERVAL);
    });

    expect(result.current.currentImage).toBe(SLIDE_IMAGES[0]);
  });

  it('should clean up interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    const { unmount } = renderHook(() => useImageSlider());

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();

    clearIntervalSpy.mockRestore();
  });
});
