import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import { managedWordpressWebsitesDetailsMock } from '@/data/__mocks__/managedWordpress/website';
import { wrapper } from '@/utils/test.provider';

import { useManagedWordpressWebsiteDetails } from './useManagedWordpressWebsiteDetails';

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
