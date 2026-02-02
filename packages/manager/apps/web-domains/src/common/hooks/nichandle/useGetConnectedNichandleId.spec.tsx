import '@/common/setupTests';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { nichandle } from '@/common/__mocks__/nichandle';
import { wrapper } from '@/common/utils/test.provider';
import { useGetConnectedNichandleId } from './useGetConnectedNichandleId';

describe('useGetConnectedNichandleId', () => {
  it('should return nichandle information from shell environment', async () => {
    const { result } = renderHook(() => useGetConnectedNichandleId(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.nichandle).toEqual(nichandle.nichandle);
    });
  });
});
