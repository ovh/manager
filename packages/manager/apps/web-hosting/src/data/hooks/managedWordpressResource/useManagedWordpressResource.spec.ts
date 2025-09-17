import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import { managedWordpressResourceMock } from '@/data/__mocks__';
import { wrapper } from '@/utils/test.provider';

import { useManagedWordpressResource } from './useManagedWordpressResource';

describe('useManagedWordpressResource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should return resource list', async () => {
    const { result } = renderHook(() => useManagedWordpressResource(), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(managedWordpressResourceMock);
  });
});
