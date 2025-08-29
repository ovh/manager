import { describe, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { tasksMocks } from '@/data/__mocks__';
import { useGetTaskDetails } from './useWebHostingTask';
import { wrapper } from '@/utils/test.provider';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn().mockReturnValue({
      data: tasksMocks,
      headers: { 'x-pagination-total': '1' },
    }),
  },
}));

describe('useGetTaskDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return webhosting ongoing tasks list ', async () => {
    const { result } = renderHook(() => useGetTaskDetails('servicename'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(tasksMocks);
    });
  });
});
