import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as partnerApi from '@/data/api/ai/partner/partner.api';
import { mockedPartner } from '@/__tests__/helpers/mocks/partner/partner';
import { useGetPartner } from './useGetPartner.hook';

vi.mock('@/data/api/ai/partner/partner.api', () => ({
  getPartner: vi.fn(),
}));

describe('useGetParter', () => {
  it('should return Partner', async () => {
    const projectId = 'projectId';
    const region = 'regionId';

    vi.mocked(partnerApi.getPartner).mockResolvedValue([mockedPartner]);

    const { result } = renderHook(() => useGetPartner(projectId, region), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedPartner]);
      expect(partnerApi.getPartner).toHaveBeenCalledWith({
        projectId,
        region,
      });
    });
  });
});
