import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as capabilitiesApi from '@/data/api/ai/capabilities/capabilities.api';
import { mockedCapabilitiesQpuFlavor } from '@/__tests__/helpers/mocks/capabilities/qpuFlavor';
import { useGetQpuFlavor } from './useGetQpuFlavor.hook';

vi.mock('@/data/api/ai/capabilities/capabilities.api', () => ({
  getFlavor: vi.fn(),
}));

describe('useGetQpuFlavor', () => {
  it('should return QpuFlavor capabilities by region', async () => {
    const projectId = 'projectId';
    const region = 'region';
    const qpuFlavorId = 'qpuFlavorId';

    vi.mocked(capabilitiesApi.getQpuFlavor).mockResolvedValue(
      mockedCapabilitiesQpuFlavor,
    );

    const { result } = renderHook(
      () => useGetQpuFlavor(projectId, region, qpuFlavorId),
      {
        wrapper: QueryClientWrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedCapabilitiesQpuFlavor]);
      expect(capabilitiesApi.getQpuFlavor).toHaveBeenCalledWith({
        projectId,
        region,
      });
    });
  });
});
