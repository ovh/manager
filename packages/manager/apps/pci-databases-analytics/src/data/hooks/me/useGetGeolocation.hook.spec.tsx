import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as meApi from '@/data/api/me/me.api';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useGetGeolocation } from './useGetGeolocation.hook';
import { mockedGeolocation } from '@/__tests__/helpers/mocks/me';

vi.mock('@/data/api/me/me.api', () => ({
  getGeolocation: vi.fn(),
}));

describe('useGetGeolocation', () => {
  it('should return user location', async () => {
    vi.mocked(meApi.getGeolocation).mockResolvedValue(mockedGeolocation);

    const { result } = renderHook(() => useGetGeolocation(), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedGeolocation);
      expect(meApi.getGeolocation).toHaveBeenCalled();
    });
  });
});
