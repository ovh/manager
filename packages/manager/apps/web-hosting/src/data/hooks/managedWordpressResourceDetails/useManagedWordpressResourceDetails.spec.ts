import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { managedWordpressResourceDetailsMock } from '@/data/__mocks__';
import { useManagedWordpressResourceDetails } from './useManagedWordpressResourceDetails';
import { wrapper } from '@/utils/test.provider';

describe('useManagedWordpressResourceDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should return resource details', async () => {
    const { result } = renderHook(
      () => useManagedWordpressResourceDetails('test'),
      {
        wrapper,
      },
    );
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(managedWordpressResourceDetailsMock);
  });
});
