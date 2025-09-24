import { vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import useUserActivity from '@/hooks/useUserActivity';

describe('useUserActivity', () => {
  vi.useFakeTimers();

  const setup = (timeout: number, onInactive = vi.fn(), onActive = vi.fn()) => {
    return renderHook(() => useUserActivity({ timeout, onInactive, onActive }));
  };

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should set isActive to true initially', () => {
    const { result } = setup(1000);
    expect(result.current).toBe(true);
  });

  it('should call onInactive after timeout', () => {
    const onInactive = vi.fn();
    setup(1000, onInactive);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onInactive).toHaveBeenCalled();
  });

  it('should reset the timeout on activity', () => {
    const onInactive = vi.fn();
    const { result } = setup(1000, onInactive);

    act(() => {
      window.dispatchEvent(new Event('mousemove'));
      vi.advanceTimersByTime(500);
      window.dispatchEvent(new Event('keypress'));
      vi.advanceTimersByTime(500);
      window.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(500);
      window.dispatchEvent(new Event('click'));
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe(true);
    expect(onInactive).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onInactive).toHaveBeenCalled();
  });

  it('should call onActive when becoming active again', () => {
    const onActive = vi.fn();
    const onInactive = vi.fn();
    const { result } = setup(1000, onInactive, onActive);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(false);
    expect(onInactive).toHaveBeenCalled();

    act(() => {
      window.dispatchEvent(new Event('mousemove'));
    });

    expect(result.current).toBe(true);
    expect(onActive).toHaveBeenCalled();
  });
});
