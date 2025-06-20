import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { useSlots } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';
import { slotsMock } from '@/data/api';

describe('useSlots', () => {
  it('should return a list of slots', async () => {
    const { result } = renderHook(() => useSlots(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(slotsMock);
  });
});
