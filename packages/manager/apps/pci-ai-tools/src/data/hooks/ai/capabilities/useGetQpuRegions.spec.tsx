import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as capabilitiesApi from '@/data/api/ai/capabilities/capabilities.api';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/capabilities/region';
import { useGetQpuRegions } from './useGetQpuRegions.hook';

vi.mock('@/data/api/ai/capabilities/capabilities.api', () => ({
  getRegions: vi.fn(),
}));

describe('useGetQpuRegions', () => {
  it('should return capabilities region', async () => {
    const projectId = 'projectId';

    vi.mocked(capabilitiesApi.getRegions).mockResolvedValue([
      mockedCapabilitiesRegionGRA,
    ]);

    const { result } = renderHook(() => useGetQpuRegions(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedCapabilitiesRegionGRA]);
      expect(capabilitiesApi.getQpuRegions).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});
