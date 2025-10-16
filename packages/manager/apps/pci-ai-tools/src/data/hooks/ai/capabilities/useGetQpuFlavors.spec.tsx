import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as capabilitiesApi from '@/data/api/ai/capabilities/capabilities.api';
import { mockedCapabilitiesQpuFlavor } from '@/__tests__/helpers/mocks/capabilities/qpuFlavor';
import { useGetQpuFlavors } from './useGetQpuFlavors.hook';

vi.mock('@/data/api/ai/capabilities/capabilities.api', () => ({
  getFlavor: vi.fn(),
}));

describe('useGetQpuFlavors', () => {
  it('should return QpuFlavor capabilities by region', async () => {
    const projectId = 'projectId';
    const region = 'region';

    vi.mocked(capabilitiesApi.getQpuFlavors).mockResolvedValue([
      mockedCapabilitiesQpuFlavor,
    ]);

    const { result } = renderHook(() => useGetQpuFlavors(projectId, region), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedCapabilitiesQpuFlavor]);
      expect(capabilitiesApi.getQpuFlavors).toHaveBeenCalledWith({
        projectId,
        region,
      });
    });
  });
});
