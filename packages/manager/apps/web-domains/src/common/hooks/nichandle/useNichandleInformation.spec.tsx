import '@/common/setupTests';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { nichandle } from '@/common/__mocks__/nichandle';
import { wrapper } from '@/common/utils/test.provider';
import { useNichandleInformation } from './useNichandleInformation';

describe('useNichandleInformation', () => {
  it('should return nichandle information from shell environment', async () => {
    const { result } = renderHook(() => useNichandleInformation(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.nichandleInformation).toEqual(nichandle);
    });
  });
});
