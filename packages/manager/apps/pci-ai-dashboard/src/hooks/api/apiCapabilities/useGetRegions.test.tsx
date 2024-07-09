import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as capabilitiesApi from '@/data/api/apiCapabilities';
import { useGetRegions } from '@/hooks/api/apiCapabilities/useGetRegions';
import { mockedCapabilitiesRegion } from '@/__tests__/helpers/mocks/region';

vi.mock('@/data/api/apiCapabilities', () => ({
  getRegions: vi.fn(),
}));

describe('useGetRegions', () => {
  it('should return capabilities region', async () => {
    const projectId = 'projectId';

    vi.mocked(capabilitiesApi.getRegions).mockResolvedValue([
      mockedCapabilitiesRegion,
    ]);

    const { result } = renderHook(() => useGetRegions(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedCapabilitiesRegion]);
      expect(capabilitiesApi.getRegions).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});
