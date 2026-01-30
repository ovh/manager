import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { publicServiceMock } from '@/data/__mocks__/videoCenter';
import { wrapper } from '@/utils/test.provider';

import { useVideoCenter } from '../useVideoCenter';

describe('useVideoCenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return video center service list', async () => {
    const { result } = renderHook(() => useVideoCenter('test-service-id'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(publicServiceMock);
  });
});
