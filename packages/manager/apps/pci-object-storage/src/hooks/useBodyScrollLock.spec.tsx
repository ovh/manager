import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useBodyScrollLock } from './useBodyScrollLock.hook';

describe('useBodyScrollLock', () => {
  const originalOverflow = document.body.style.overflow;

  afterEach(() => {
    document.body.style.overflow = originalOverflow;
  });

  it('should set body overflow to hidden when isOpen is true', () => {
    renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body overflow when unmounted', () => {
    const { unmount } = renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe(originalOverflow);
  });

  it('should not change body overflow when isOpen is false', () => {
    renderHook(() => useBodyScrollLock(false));
    expect(document.body.style.overflow).toBe(originalOverflow);
  });
});
