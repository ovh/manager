import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as jobApi from '@/data/api/ai/job/capabilities/image.api';
import { mockedPresetImage } from '@/__tests__/helpers/mocks/job/presetImage';
import { useGetImage } from './useGetImage.hook';

vi.mock('@/data/api/ai/job/capabilities/image.api', () => ({
  getPresetImage: vi.fn(),
}));

describe('useGetImages', () => {
  it('should return PresetImage', async () => {
    const projectId = 'projectId';

    vi.mocked(jobApi.getPresetImage).mockResolvedValue([mockedPresetImage]);

    const { result } = renderHook(() => useGetImage(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedPresetImage]);
      expect(jobApi.getPresetImage).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});
