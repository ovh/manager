import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import { managedWordpressResourceDetailsMock } from '@/data/__mocks__/managedWordpress/ressource';
import { wrapper } from '@/utils/test.provider';

import { useManagedWordpressResourceDetails } from './useManagedWordpressResourceDetails';

describe('useManagedWordpressResourceDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should return resource details', async () => {
    const { result } = renderHook(() => useManagedWordpressResourceDetails('test'), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(managedWordpressResourceDetailsMock);
  });
});
