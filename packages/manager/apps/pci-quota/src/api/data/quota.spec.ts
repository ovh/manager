import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getQuotas, orderQuota, Quota, IQuota } from './quota';

describe('Quota API', () => {
  describe('getQuotas', () => {
    it('fetches quotas successfully', async () => {
      // Arrange
      const projectId = 'test-project';
      const mockData: IQuota[] = [
        {
          region: 'region1',
          fullRegionName: 'Region 1',
          instance: {
            maxCores: 10,
            maxInstances: 5,
            maxRam: 2048,
            usedCores: 2,
            usedInstances: 1,
            usedRAM: 512,
          },
          loadbalancer: {
            maxLoadbalancers: 2,
            usedLoadbalancers: 1,
          },
          network: {
            maxFloatingIPs: 5,
            maxGateways: 2,
            maxNetworks: 3,
            maxSubnets: 4,
            usedFloatingIPs: 1,
            usedGateways: 1,
            usedNetworks: 2,
            usedSubnets: 3,
          },
          volume: {
            maxBackupGigabytes: 100,
            maxGigabytes: 500,
            maxVolumeBackupCount: 10,
            maxVolumeCount: 20,
            usedBackupGigabytes: 50,
            usedGigabytes: 200,
            volumeBackupCount: 5,
            volumeCount: 10,
          },
        },
      ];
      vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });

      // Act
      const result = await getQuotas(projectId);

      // Assert
      expect(v6.get).toHaveBeenCalledWith(`/cloud/project/${projectId}/quota`);
      expect(result).toEqual(mockData);
    });

    it('handles errors when fetching quotas', async () => {
      // Arrange
      const projectId = 'test-project';
      const errorMessage = 'Network Error';
      vi.mocked(v6.get).mockRejectedValueOnce(new Error(errorMessage));

      // Act & Assert
      await expect(getQuotas(projectId)).rejects.toThrow(errorMessage);
      expect(v6.get).toHaveBeenCalledWith(`/cloud/project/${projectId}/quota`);
    });
  });

  describe('orderQuota', () => {
    it('orders quota successfully', async () => {
      // Arrange
      const projectId = 'test-project';
      const cartId = 'test-cart';
      const planCode = 'test-plan';
      const duration = 'P1M';
      const pricingMode = 'default';
      const mockData = { url: 'https://example.com' };
      vi.mocked(v6.post).mockResolvedValueOnce({ data: mockData });

      // Act
      const result = await orderQuota(
        projectId,
        cartId,
        planCode,
        duration,
        pricingMode,
      );

      // Assert
      expect(v6.post).toHaveBeenCalledWith(
        `/order/cartServiceOption/cloud/${projectId}`,
        {
          cartId,
          quantity: 1,
          planCode,
          duration,
          pricingMode,
        },
      );
      expect(result).toEqual(mockData);
    });

    it('handles errors when ordering quota', async () => {
      // Arrange
      const projectId = 'test-project';
      const cartId = 'test-cart';
      const planCode = 'test-plan';
      const duration = 'P1M';
      const pricingMode = 'default';
      const errorMessage = 'Network Error';
      vi.mocked(v6.post).mockRejectedValueOnce(new Error(errorMessage));

      // Act & Assert
      await expect(
        orderQuota(projectId, cartId, planCode, duration, pricingMode),
      ).rejects.toThrow(errorMessage);
      expect(v6.post).toHaveBeenCalledWith(
        `/order/cartServiceOption/cloud/${projectId}`,
        {
          cartId,
          quantity: 1,
          planCode,
          duration,
          pricingMode,
        },
      );
    });
  });

  describe('Quota class', () => {
    const mockQuota: IQuota = {
      region: 'region1',
      fullRegionName: 'Region 1',
      instance: {
        maxCores: 10,
        maxInstances: 5,
        maxRam: 2048,
        usedCores: 2,
        usedInstances: 1,
        usedRAM: 512,
      },
      loadbalancer: {
        maxLoadbalancers: 2,
        usedLoadbalancers: 1,
      },
      network: {
        maxFloatingIPs: 5,
        maxGateways: 2,
        maxNetworks: 3,
        maxSubnets: 4,
        usedFloatingIPs: 1,
        usedGateways: 1,
        usedNetworks: 2,
        usedSubnets: 3,
      },
      volume: {
        maxBackupGigabytes: 100,
        maxGigabytes: 500,
        maxVolumeBackupCount: 10,
        maxVolumeCount: 20,
        usedBackupGigabytes: 50,
        usedGigabytes: 200,
        volumeBackupCount: 5,
        volumeCount: 10,
      },
    };

    it('calculates instance usage percentages correctly', () => {
      const quota = new Quota(mockQuota);
      expect(quota.instanceInstancesUsage).toBeCloseTo(20);
      expect(quota.instanceCpuUsage).toBeCloseTo(20);
      expect(quota.instanceRamUsage).toBeCloseTo(25);
    });

    it('checks if instance quota is above threshold', () => {
      const quota = new Quota(mockQuota);
      expect(quota.isInstanceQuotaAboveThreshold).toBe(false);
    });

    it('calculates volume usage percentage correctly', () => {
      const quota = new Quota(mockQuota);
      expect(quota.volumeMemoryUsage).toBeCloseTo(40);
    });

    it('checks if volume quota is above threshold', () => {
      const quota = new Quota(mockQuota);
      expect(quota.isVolumeQuotaAboveTreshold).toBe(false);
    });

    it('checks if quota is available', () => {
      const quota = new Quota(mockQuota);
      expect(quota.isQuotaAvailable).toBe(true);
    });

    it('checks if instance quota threshold is reached', () => {
      const quota = new Quota(mockQuota);
      expect(quota.isInstanceQuotaThresholdReached).toBe(false);
    });

    it('checks if CPU quota threshold is reached', () => {
      const quota = new Quota(mockQuota);
      expect(quota.isCpuQuotaThresholdReached).toBe(false);
    });

    it('checks if RAM quota threshold is reached', () => {
      const quota = new Quota(mockQuota);
      expect(quota.isRamQuotaThresholdReached).toBe(false);
    });

    it('checks if volume quota threshold is reached', () => {
      const quota = new Quota(mockQuota);
      expect(quota.isVolumeQuotaThresholdReached).toBe(false);
    });
  });
});
