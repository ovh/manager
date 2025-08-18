import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { managedWordpressWebsitesTaskMock } from '@/data/__mocks__';
import { useManagedWordpressResourceTasks } from './useManagedWordpressResourceTasks';
import { wrapper } from '@/utils/test.provider';

describe('useManagedWordpressResource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should return resource list', async () => {
    const { result } = renderHook(
      () => useManagedWordpressResourceTasks('test'),
      {
        wrapper,
      },
    );
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(managedWordpressWebsitesTaskMock);
  });
});
