import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as capabilitiesApi from '@/data/api/ai/capabilities/capabilities.api';
import { mockedCapabilitiesQPUFlavor } from '@/__tests__/helpers/mocks/capabilities/qpuFlavor';
import { useGetQPUFlavors } from './useGetQPUFlavors.hook';

vi.mock('@/data/api/ai/capabilities/capabilities.api', () => ({
  getFlavor: vi.fn(),
}));

describe('useGetQPUFlavors', () => {
  it('should return QPUFlavor capabilities by region', async () => {
    const projectId = 'projectId';
    const region = 'region';

    vi.mocked(capabilitiesApi.getQPUFlavors).mockResolvedValue([
      mockedCapabilitiesQPUFlavor,
    ]);

    const { result } = renderHook(() => useGetQPUFlavors(projectId, region), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedCapabilitiesQPUFlavor]);
      expect(capabilitiesApi.getFlavor).toHaveBeenCalledWith({
        projectId,
        region,
      });
    });
  });
});
