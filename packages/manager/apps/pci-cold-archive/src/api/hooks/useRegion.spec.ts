import { TRegion } from '@ovh-ux/manager-react-components';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { wrapper } from '@/wrapperRenders';
import {
  getProductRegionsAvailability,
  getProjectRegionDetails,
} from '@/api/data/region';
import {
  useProductRegionsAvailability,
  useProjectRegionDetails,
} from './useRegions';

vi.mock('@/api/data/region', () => ({
  getProjectRegionDetails: vi.fn(),
  getProductRegionsAvailability: vi.fn(),
}));

describe('Region Hooks', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('useProjectRegionDetails', () => {
    it('should call getProjectRegionDetails with correct parameters', async () => {
      const mockRegionDetails = {
        name: 'region1',
      } as TRegion;

      vi.mocked(getProjectRegionDetails).mockResolvedValue(mockRegionDetails);

      const projectId = 'project123';
      const region = 'GRA';

      const { result } = renderHook(
        () => useProjectRegionDetails(projectId, region),
        { wrapper },
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(getProjectRegionDetails).toHaveBeenCalledTimes(1);
      expect(getProjectRegionDetails).toHaveBeenCalledWith(projectId, region);

      expect(result.current.data).toEqual(mockRegionDetails);
    });

    it('should not fetch when projectId or region is missing', async () => {
      const { result } = renderHook(() => useProjectRegionDetails('', 'GRA'), {
        wrapper,
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(getProjectRegionDetails).not.toHaveBeenCalled();

      const { result: result2 } = renderHook(
        () => useProjectRegionDetails('project123', ''),
        { wrapper },
      );

      expect(result2.current.isLoading).toBe(false);
      expect(result2.current.fetchStatus).toBe('idle');
      expect(getProjectRegionDetails).not.toHaveBeenCalled();
    });

    it('should handle error state correctly', async () => {
      const errorMessage = 'Failed to fetch region details';
      vi.mocked(getProjectRegionDetails).mockRejectedValue(
        new Error(errorMessage),
      );

      const { result } = renderHook(
        () => useProjectRegionDetails('project123', 'GRA'),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeDefined();
      expect(result.current.error.message).toBe(errorMessage);
    });
  });

  describe('useProductRegionsAvailability', () => {
    it('should call getProductRegionsAvailability with correct parameters', async () => {
      const mockAvailability = ['BHS', 'US'];

      vi.mocked(getProductRegionsAvailability).mockResolvedValue(
        mockAvailability,
      );

      const ovhSubsidiary = 'FR';
      const planCode = 'plan123';

      const { result } = renderHook(
        () => useProductRegionsAvailability(ovhSubsidiary, planCode),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(getProductRegionsAvailability).toHaveBeenCalledTimes(1);
      expect(getProductRegionsAvailability).toHaveBeenCalledWith(
        ovhSubsidiary,
        planCode,
      );

      expect(result.current.data).toEqual(mockAvailability);
    });

    it('should not fetch when ovhSubsidiary is missing', async () => {
      const { result } = renderHook(
        () => useProductRegionsAvailability('', 'plan123'),
        { wrapper },
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(getProductRegionsAvailability).not.toHaveBeenCalled();
    });

    it('should fetch even when planCode is missing', async () => {
      const mockAvailability = [];
      vi.mocked(getProductRegionsAvailability).mockResolvedValue(
        mockAvailability,
      );

      const { result } = renderHook(
        () => useProductRegionsAvailability('FR', ''),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(getProductRegionsAvailability).toHaveBeenCalledTimes(1);
      expect(getProductRegionsAvailability).toHaveBeenCalledWith('FR', '');
    });

    it('should handle error state correctly', async () => {
      const errorMessage = 'Failed to fetch regions availability';
      vi.mocked(getProductRegionsAvailability).mockRejectedValue(
        new Error(errorMessage),
      );

      const { result } = renderHook(
        () => useProductRegionsAvailability('FR', 'plan123'),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeDefined();
      expect(result.current.error.message).toBe(errorMessage);
    });
  });
});
