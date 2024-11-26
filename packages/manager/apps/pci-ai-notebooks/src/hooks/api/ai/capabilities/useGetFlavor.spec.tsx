import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as capabilitiesApi from '@/data/api/ai/capabilities.api';
import { mockedCapabilitiesFlavor } from '@/__tests__/helpers/mocks/flavor';
import { useGetFlavor } from './useGetFlavor.hook';

vi.mock('@/data/api/ai/capabilities.api', () => ({
  getFlavor: vi.fn(),
}));

describe('useGetFlavor', () => {
  it('should return flavor capabilities by region', async () => {
    const projectId = 'projectId';
    const region = 'region';

    vi.mocked(capabilitiesApi.getFlavor).mockResolvedValue([
      mockedCapabilitiesFlavor,
    ]);

    const { result } = renderHook(() => useGetFlavor(projectId, region), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedCapabilitiesFlavor]);
      expect(capabilitiesApi.getFlavor).toHaveBeenCalledWith({
        projectId,
        region,
      });
    });
  });
});
