import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { managedWordpressWebsitesMock } from '@/data/__mocks__';
import { useManagedWordpressWebsites } from './useManagedWordpressWebsites';
import { wrapper } from '@/utils/test.provider';

describe('useManagedWordpressWebsites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should return resource list', async () => {
    const { result } = renderHook(() => useManagedWordpressWebsites('test'), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(managedWordpressWebsitesMock);
  });
});
