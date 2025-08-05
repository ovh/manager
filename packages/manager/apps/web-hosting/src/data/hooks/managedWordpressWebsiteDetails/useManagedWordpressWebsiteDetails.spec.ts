import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { managedWordpressWebsitesDetailsMock } from '@/data/__mocks__';
import { useManagedWordpressWebsiteDetails } from './useManagedWordpressWebsiteDetails';
import { wrapper } from '@/utils/test.provider';

describe('useManagedWordpressWebsiteDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should return details website', async () => {
    const { result } = renderHook(
      () => useManagedWordpressWebsiteDetails('test', 'websiteTestId'),
      {
        wrapper,
      },
    );
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(managedWordpressWebsitesDetailsMock);
  });
});
