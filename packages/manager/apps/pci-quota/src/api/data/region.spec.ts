import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getAvailableRegions } from './region';

describe('Region API', () => {
  describe('getAvailableRegions', () => {
    it('fetches available regions successfully', async () => {
      // Arrange
      const projectId = 'test-project';
      const mockData = [{ name: 'region1' }, { name: 'region2' }];
      const url = `/cloud/project/${projectId}/regionAvailable`;
      vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });

      // Act
      const result = await getAvailableRegions(projectId);

      // Assert
      expect(v6.get).toHaveBeenCalledWith(url, {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
        },
      });
      expect(result).toEqual(mockData);
    });

    it('handles errors when fetching available regions', async () => {
      // Arrange
      const projectId = 'test-project';
      const url = `/cloud/project/${projectId}/regionAvailable`;
      const errorMessage = 'Network Error';
      vi.mocked(v6.get).mockRejectedValueOnce(new Error(errorMessage));

      // Act & Assert
      await expect(getAvailableRegions(projectId)).rejects.toThrow(
        errorMessage,
      );
      expect(v6.get).toHaveBeenCalledWith(url, {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
        },
      });
    });
  });
});
