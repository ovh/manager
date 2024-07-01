import { describe, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTranslatedBytes } from '@/hooks/useTranslatedBytes';

describe('useTranslatedBytes', () => {
  it('returns raw bytes when toRawBytes is true', () => {
    const { result } = renderHook(() =>
      useTranslatedBytes(1024, 2, false, 'KB', true),
    );
    expect(result.current).toBe(1024 * 1000);
  });

  it('returns correct value when converting from KB to bytes', () => {
    const { result } = renderHook(() =>
      useTranslatedBytes(1, 2, false, 'KB', false),
    );
    expect(result.current).toBe('1 KB');
  });

  it('returns correct value when converting from MB to bytes', () => {
    const { result } = renderHook(() =>
      useTranslatedBytes(1, 2, false, 'MB', false),
    );
    expect(result.current).toBe('1 MB');
  });

  it('returns correct value when converting from GB to bytes', () => {
    const { result } = renderHook(() =>
      useTranslatedBytes(1, 2, false, 'GB', false),
    );
    expect(result.current).toBe('1 GB');
  });

  it('returns correct value when converting from TB to bytes', () => {
    const { result } = renderHook(() =>
      useTranslatedBytes(1, 2, false, 'TB', false),
    );
    expect(result.current).toBe('1 TB');
  });

  it('returns correct value when converting from PB to bytes', () => {
    const { result } = renderHook(() =>
      useTranslatedBytes(1, 2, false, 'PB', false),
    );
    expect(result.current).toBe('1 PB');
  });

  it('returns correct value when converting from EB to bytes', () => {
    const { result } = renderHook(() =>
      useTranslatedBytes(1, 2, false, 'EB', false),
    );
    expect(result.current).toBe('1 EB');
  });

  it('returns correct value when converting from ZB to bytes', () => {
    const { result } = renderHook(() =>
      useTranslatedBytes(1, 2, false, 'ZB', false),
    );
    expect(result.current).toBe('1 ZB');
  });

  it('returns correct value when converting from YB to bytes', () => {
    const { result } = renderHook(() =>
      useTranslatedBytes(1, 2, false, 'YB', false),
    );
    expect(result.current).toBe('1 YB');
  });

  it('returns "?" when input is not a number', () => {
    const { result } = renderHook(() =>
      useTranslatedBytes(NaN, 2, false, 'KB', false),
    );
    expect(result.current).toBe('?');
  });

  it('returns "0" when input is 0', () => {
    const { result } = renderHook(() =>
      useTranslatedBytes(0, 2, false, 'KB', false),
    );
    expect(result.current).toBe('0');
  });
  it('returns value with precision of 0', () => {
    const { result } = renderHook(() =>
      useTranslatedBytes(1024, undefined, false, '', false),
    );
    expect(result.current).toBe('1 KB');
  });
  it('returns correct value when converting from KB to Kib', () => {
    const { result } = renderHook(() =>
      useTranslatedBytes(1, 2, true, 'KiB', false),
    );
    expect(result.current).toBe('1 KiB');
  });
  it('returns uncorrect value "?"', () => {
    const { result } = renderHook(() =>
      useTranslatedBytes(1, 2, true, 'BiB', false),
    );
    expect(result.current).toBe('?');
  });
});
