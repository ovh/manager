import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { useUrl } from './useUrl';
import { renderHook } from '@/test.provider';

describe('useUrl', () => {
  it('should return relative url', async () => {
    const { result } = renderHook(() => useUrl('./add'));
    expect(result.current).toBe('./add');
  });

  it('should return relative url with params', async () => {
    const { result } = renderHook(() =>
      useUrl('./delete', {
        id: '5859f8b7-3ebf-4cd5-a483-68b7fc48ce56',
      }),
    );
    expect(result.current).toBe(
      './delete?id=5859f8b7-3ebf-4cd5-a483-68b7fc48ce56',
    );
  });
});
