import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { taskMocks } from '@/data/api';
import { useTasks } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useTasks', () => {
  it('should return a list of tasks', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(taskMocks);
  });
});
