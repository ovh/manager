import { act, renderHook } from '@testing-library/react';
import { describe, it } from 'vitest';
import { useStep } from './useStep';

describe('useStep hook', () => {
  it('initializes with default state when no initial state is provided', () => {
    const { result } = renderHook(() => useStep());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.isChecked).toBe(false);
    expect(result.current.isLocked).toBe(false);
  });

  it('initializes with provided initial state', () => {
    const initialState = { isOpen: true, isChecked: true, isLocked: true };
    const { result } = renderHook(() => useStep(initialState));
    expect(result.current.isOpen).toBe(true);
    expect(result.current.isChecked).toBe(true);
    expect(result.current.isLocked).toBe(true);
  });

  it('opens step', () => {
    const { result } = renderHook(() => useStep());
    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);
  });

  it('closes step', () => {
    const { result } = renderHook(() => useStep({ isOpen: true }));
    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('checks step', () => {
    const { result } = renderHook(() => useStep());
    act(() => {
      result.current.check();
    });
    expect(result.current.isChecked).toBe(true);
  });

  it('unchecks step', () => {
    const { result } = renderHook(() => useStep({ isChecked: true }));
    act(() => {
      result.current.uncheck();
    });
    expect(result.current.isChecked).toBe(false);
  });

  it('locks step', () => {
    const { result } = renderHook(() => useStep());
    act(() => {
      result.current.lock();
    });
    expect(result.current.isLocked).toBe(true);
  });

  it('unlocks step', () => {
    const { result } = renderHook(() => useStep({ isLocked: true }));
    act(() => {
      result.current.unlock();
    });
    expect(result.current.isLocked).toBe(false);
  });
});
