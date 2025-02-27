import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as capabilitiesApi from '@/data/api/ai/capabilities.api';
import { mockedCapaAppImage } from '@/__tests__/helpers/mocks/capabilities/partnerAppImage';
import { useGetAppImages } from './useGetAppImage.hook';

vi.mock('@/data/api/ai/capabilities.api', () => ({
  getAppImages: vi.fn(),
}));

describe('useGetAppImage', () => {
  it('should return app images by region', async () => {
    const projectId = 'projectId';
    const region = 'region';

    vi.mocked(capabilitiesApi.getAppImages).mockResolvedValue([
      mockedCapaAppImage,
    ]);

    const { result } = renderHook(() => useGetAppImages(projectId, region), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedCapaAppImage]);
      expect(capabilitiesApi.getAppImages).toHaveBeenCalledWith({
        projectId,
        region,
      });
    });
  });
});
