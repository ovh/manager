import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { OvhSubsidiaryEnum } from '@datatr-ux/ovhcloud-types/nichandle';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as availabilityApi from '@/data/api/availability/availability.api';
import { useGetProductAvailability } from './useGetProductAvailability.hook';
import { mockedAvailability } from '@/__tests__/helpers/mocks/availability/availability';

// Mock du hook useUser
vi.mock('@/hooks/useUser', () => ({
  useUser: () => ({
    ovhSubsidiary: OvhSubsidiaryEnum.FR,
  }),
}));

// Mock de l'API
vi.mock('@/data/api/availability/availability.api', () => ({
  getProductAvailability: vi.fn(),
}));

describe('useGetProductAvailability', () => {
  it('should fetch product availability and return data', async () => {
    vi.mocked(availabilityApi.getProductAvailability).mockResolvedValue(
      mockedAvailability,
    );

    const { result } = renderHook(
      () => useGetProductAvailability('projectId'),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedAvailability);
      expect(availabilityApi.getProductAvailability).toHaveBeenCalledWith({
        projectId: 'projectId',
        ovhSubsidiary: OvhSubsidiaryEnum.FR,
      });
    });
  });
});
