import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getServices, getServiceInfos, getService } from './service';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn(),
  },
}));

describe('Service API', () => {
  describe('getServices', () => {
    it('fetches services successfully', async () => {
      // Arrange
      const mockData = [
        {
          resource: {
            name: 'service1',
          },
          serviceId: '1',
        },
      ];
      vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });

      // Act
      const result = await getServices();

      // Assert
      expect(v6.get).toHaveBeenCalledWith('services', {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Cursor',
          'X-Pagination-Sort': 'resource.product.name',
          'X-Pagination-Sort-Order': 'ASC',
        },
      });
      expect(result).toEqual(mockData);
    });

    it('handles errors when fetching services', async () => {
      // Arrange
      const errorMessage = 'Network Error';
      vi.mocked(v6.get).mockRejectedValueOnce(new Error(errorMessage));

      // Act & Assert
      await expect(getServices()).rejects.toThrow(errorMessage);
      expect(v6.get).toHaveBeenCalledWith('services', {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Cursor',
          'X-Pagination-Sort': 'resource.product.name',
          'X-Pagination-Sort-Order': 'ASC',
        },
      });
    });
  });

  describe('getServiceInfos', () => {
    it('fetches service infos successfully', async () => {
      // Arrange
      const projectId = '123';
      const mockData = { serviceId: '1' };
      vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });

      // Act
      const result = await getServiceInfos(projectId);

      // Assert
      expect(v6.get).toHaveBeenCalledWith(
        `/cloud/project/${projectId}/serviceInfos`,
      );
      expect(result).toEqual(mockData);
    });

    it('handles errors when fetching service infos', async () => {
      // Arrange
      const projectId = '123';
      const errorMessage = 'Network Error';
      vi.mocked(v6.get).mockRejectedValueOnce(new Error(errorMessage));

      // Act & Assert
      await expect(getServiceInfos(projectId)).rejects.toThrow(errorMessage);
      expect(v6.get).toHaveBeenCalledWith(
        `/cloud/project/${projectId}/serviceInfos`,
      );
    });
  });

  describe('getService', () => {
    it('fetches a service successfully', async () => {
      // Arrange
      const serviceId = '1';
      const mockData = {
        resource: {
          name: 'service1',
        },
        serviceId: '1',
      };
      vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });

      // Act
      const result = await getService(serviceId);

      // Assert
      expect(v6.get).toHaveBeenCalledWith(`/services/${serviceId}`);
      expect(result).toEqual(mockData);
    });

    it('handles errors when fetching a service', async () => {
      // Arrange
      const serviceId = '1';
      const errorMessage = 'Network Error';
      vi.mocked(v6.get).mockRejectedValueOnce(new Error(errorMessage));

      // Act & Assert
      await expect(getService(serviceId)).rejects.toThrow(errorMessage);
      expect(v6.get).toHaveBeenCalledWith(`/services/${serviceId}`);
    });
  });
});
