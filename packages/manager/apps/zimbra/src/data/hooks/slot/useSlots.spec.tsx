import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { slotsMock } from '@/data/api';
import { useSlots } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useSlots', () => {
  it('should return a list of slots', async () => {
    const { result } = renderHook(() => useSlots(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(slotsMock);
  });
});
