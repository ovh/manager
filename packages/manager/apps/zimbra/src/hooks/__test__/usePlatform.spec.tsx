import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { usePlatform } from '../usePlatform';
import { platformMock } from '@/api/_mock_';
import { wrapper } from '@/utils/test.provider';

describe('usePlatform', () => {
  it('should return the first element of the platform list', async () => {
    const { result } = renderHook(() => usePlatform(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(platformMock[0]);
  });
});
