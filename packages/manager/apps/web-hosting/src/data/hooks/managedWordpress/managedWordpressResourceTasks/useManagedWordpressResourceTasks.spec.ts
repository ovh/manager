import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import { managedWordpressWebsitesTaskMock } from '@/data/__mocks__/managedWordpress/tasks';
import { wrapper } from '@/utils/test.provider';

import { useManagedWordpressResourceTasks } from './useManagedWordpressResourceTasks';

describe('useManagedWordpressResource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should return resource list', async () => {
    const { result } = renderHook(() => useManagedWordpressResourceTasks('test'), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(managedWordpressWebsitesTaskMock);
  });
});
