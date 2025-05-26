import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { useSlotService } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';
import { serviceMock } from '@/data/api';

describe('useSlotService', () => {
  it('should return the detail of a slot service', async () => {
    const { result } = renderHook(() => useSlotService(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(serviceMock);
  });
});
