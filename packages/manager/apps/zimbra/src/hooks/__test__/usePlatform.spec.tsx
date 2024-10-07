import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { usePlatform } from '../usePlatform';
import { platformMock } from '@/api/_mock_';
import { wrapper } from '@/utils/test.provider';

vi.mock('@/api/platform/api', () => {
  const mock = vi.fn(() => Promise.resolve(platformMock));
  return {
    getZimbraPlatformList: mock,
  };
});

describe('usePlatform', () => {
  it('should return the first element of the platform list', async () => {
    const { result } = renderHook(() => usePlatform(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(platformMock[0]);
  });
});
