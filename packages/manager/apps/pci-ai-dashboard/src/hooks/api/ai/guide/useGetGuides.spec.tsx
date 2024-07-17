import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as guideApi from '@/data/api/ai/guide.api';
import { mockedGuides } from '@/__tests__/helpers/mocks/guide';
import { useGetGuides } from './useGetGuides.hook';

vi.mock('@/data/api/ai/guide.api', () => ({
  getGuides: vi.fn(),
}));

describe('useGetGuides', () => {
  it('should return Guides', async () => {
    const projectId = 'projectId';

    vi.mocked(guideApi.getGuides).mockResolvedValue([mockedGuides]);

    const { result } = renderHook(() => useGetGuides(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedGuides]);
      expect(guideApi.getGuides).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});
