import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDebouncedValue } from '../debouncedValue/useDebouncedValue';

const { mockCancel, mockUseDebounce } = vi.hoisted(() => {
  const cancel = vi.fn();
  const useDebounce = vi.fn(() => [undefined, cancel]);
  return {
    mockCancel: cancel,
    mockUseDebounce: useDebounce,
  };
});

vi.mock('react-use/lib/useDebounce', () => ({
  default: mockUseDebounce,
}));

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with default value', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 500));

    expect(result.current[0]).toBe('initial');
    expect(result.current[2]).toBe('initial');
    expect(typeof result.current[1]).toBe('function');
    expect(typeof result.current[3]).toBe('function');
    expect(typeof result.current[4]).toBe('function');
  });

  it('should update value immediately when setValue is called', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 500));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(result.current[2]).toBe('initial');
  });

  it('should update debouncedValue after delay when value changes', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 500));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[2]).toBe('initial');

    act(() => {
      const calls = mockUseDebounce.mock.calls as unknown as Array<[() => void, number, unknown[]]>;
      const lastCall = calls[calls.length - 1];
      if (lastCall && lastCall[0]) {
        const callback = lastCall[0];
        callback();
      }
    });

    expect(result.current[2]).toBe('updated');
  });

  it('should use custom delay when provided', () => {
    renderHook(() => useDebouncedValue('initial', 1000));

    expect(mockUseDebounce).toHaveBeenCalledWith(expect.any(Function), 1000, expect.any(Array));
  });

  it('should use default delay of 500ms when not provided', () => {
    renderHook(() => useDebouncedValue('initial'));

    expect(mockUseDebounce).toHaveBeenCalledWith(expect.any(Function), 500, expect.any(Array));
  });

  it('should update debouncedValue immediately when updateDebouncedValue is called', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 500));

    act(() => {
      result.current[3]('immediate');
    });

    expect(result.current[2]).toBe('immediate');
    expect(mockCancel).toHaveBeenCalled();
  });

  it('should cancel debounce when cancel is called', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 500));

    act(() => {
      result.current[1]('updated');
    });

    act(() => {
      result.current[4]();
    });

    expect(mockCancel).toHaveBeenCalled();
  });

  it('should work with different types (number)', () => {
    const { result } = renderHook(() => useDebouncedValue(0, 500));

    expect(result.current[0]).toBe(0);
    expect(result.current[2]).toBe(0);

    act(() => {
      result.current[1](42);
    });

    expect(result.current[0]).toBe(42);

    act(() => {
      const calls = mockUseDebounce.mock.calls as unknown as Array<[() => void, number, unknown[]]>;
      const lastCall = calls[calls.length - 1];
      if (lastCall && lastCall[0]) {
        const callback = lastCall[0];
        callback();
      }
    });

    expect(result.current[2]).toBe(42);
  });

  it('should work with different types (object)', () => {
    const initial = { name: 'test', count: 0 };
    const updated = { name: 'updated', count: 1 };

    const { result } = renderHook(() => useDebouncedValue(initial, 500));

    expect(result.current[0]).toEqual(initial);
    expect(result.current[2]).toEqual(initial);

    act(() => {
      result.current[1](updated);
    });

    expect(result.current[0]).toEqual(updated);

    act(() => {
      const calls = mockUseDebounce.mock.calls as unknown as Array<[() => void, number, unknown[]]>;
      const lastCall = calls[calls.length - 1];
      if (lastCall && lastCall[0]) {
        const callback = lastCall[0];
        callback();
      }
    });

    expect(result.current[2]).toEqual(updated);
  });

  it('should update debouncedValue when updateDebouncedValue is called multiple times', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 500));

    act(() => {
      result.current[3]('first');
    });

    expect(result.current[2]).toBe('first');
    expect(mockCancel).toHaveBeenCalledTimes(1);

    act(() => {
      result.current[3]('second');
    });

    expect(result.current[2]).toBe('second');
    expect(mockCancel).toHaveBeenCalledTimes(2);
  });

  it('should handle rapid value changes and only update debouncedValue after delay', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 500));

    act(() => {
      result.current[1]('first');
    });

    act(() => {
      result.current[1]('second');
    });

    act(() => {
      result.current[1]('third');
    });

    expect(result.current[0]).toBe('third');
    expect(result.current[2]).toBe('initial');

    act(() => {
      const calls = mockUseDebounce.mock.calls as unknown as Array<[() => void, number, unknown[]]>;
      const lastCall = calls[calls.length - 1];
      if (lastCall && lastCall[0]) {
        const callback = lastCall[0];
        callback();
      }
    });

    expect(result.current[2]).toBe('third');
  });
});
