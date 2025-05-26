import { useParams } from 'react-router-dom';
import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { useSlot } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';
import { platformMock, slotMock } from '@/data/api';

describe('useSlot', () => {
  it('should return the details of a slot', async () => {
    vi.mocked(useParams).mockReturnValue({
      platformId: platformMock[0].id,
      slotId: slotMock.id,
    });

    const { result } = renderHook(() => useSlot(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(slotMock);
  });
});
