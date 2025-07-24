import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { managedCmsResourceWebsiteMock } from '@/data/__mocks__';
import { useManagedWordpressWebsiteDetails } from './useManagedWordpressWebsiteDetails';
import { wrapper } from '@/utils/test.provider';

describe('useManagedWordpressResource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should return resource list', async () => {
    const { result } = renderHook(
      () => useManagedWordpressWebsiteDetails('test'),
      {
        wrapper,
      },
    );
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(managedCmsResourceWebsiteMock);
  });
});
