import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { slotServicesMock } from '@/data/api';
import { useSlotServices } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useSlotServices', () => {
  it('should return a list of slot services', async () => {
    const { result } = renderHook(() => useSlotServices(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(slotServicesMock);
  });
});
