import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import { managedWordpressWebsitesMock } from '@/data/__mocks__/managedWordpress/website';
import { wrapper } from '@/utils/test.provider';

import { useManagedWordpressWebsites } from './useManagedWordpressWebsites';

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
