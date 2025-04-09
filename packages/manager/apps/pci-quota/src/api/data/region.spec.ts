import { describe, it, expect, vi } from 'vitest';
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { getAvailableRegions } from './region';

describe('Region API', () => {
  describe('getAvailableRegions', () => {
    it('fetches available regions successfully', async () => {
      // Arrange
      const projectId = 'test-project';
      const mockData = [{ name: 'region1' }, { name: 'region2' }];
      const url = `/cloud/project/${projectId}/regionAvailable`;
      vi.mocked(fetchIcebergV6).mockResolvedValueOnce({
        data: mockData,
        totalCount: 1,
        status: 200,
      });

      // Act
      const result = await getAvailableRegions(projectId);

      // Assert
      expect(fetchIcebergV6).toHaveBeenCalledWith({
        route: url,
        disableCache: true,
      });
      expect(result).toEqual(mockData);
    });

    it('handles errors when fetching available regions', async () => {
      // Arrange
      const projectId = 'test-project';
      const url = `/cloud/project/${projectId}/regionAvailable`;
      const errorMessage = 'Network Error';
      vi.mocked(fetchIcebergV6).mockRejectedValueOnce(new Error(errorMessage));

      // Act & Assert
      await expect(getAvailableRegions(projectId)).rejects.toThrow(
        errorMessage,
      );
      expect(fetchIcebergV6).toHaveBeenCalledWith({
        route: url,
        disableCache: true,
      });
    });
  });
});
