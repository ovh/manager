import { renderHook } from '@testing-library/react';
import { useBytes } from './useBytes';

describe('useBytes', () => {
  it('formats bytes correctly with default format (1000)', () => {
    const { result } = renderHook(() => useBytes());
    expect(result.current.formatBytes(1000)).toBe('1 unit_size_KB');
  });

  it('formats bytes correctly with 1024 format', () => {
    const { result } = renderHook(() => useBytes());
    expect(result.current.formatBytes(1024, 0, 1024)).toBe('1 unit_size_KiB');
  });

  it('formats bytes with decimals', () => {
    const { result } = renderHook(() => useBytes());
    expect(result.current.formatBytes(1550, 2)).toBe('1.55 unit_size_KB');
  });

  it('returns 0 for zero bytes', () => {
    const { result } = renderHook(() => useBytes());
    expect(result.current.formatBytes(0)).toBe(0);
  });

  it('handles large byte values correctly', () => {
    const { result } = renderHook(() => useBytes());
    expect(result.current.formatBytes(1e12)).toBe('1 unit_size_TB');
  });
});
