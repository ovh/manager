import { describe, it, expect } from 'vitest';
import {
  mapFlavorToTable,
  mapGpuFlavorToTable,
  mapFlavorToCart,
  TFlavorData,
  TGpuFlavorData,
} from '../flavorsViewModel';

describe('flavorsViewModel mappers', () => {
  const baseFlavor: TFlavorData = {
    unavailable: false,
    unavailableQuota: false,
    name: 'b3-8',
    memory: 8,
    vCore: 2,
    storage: '50NVMe',
    bandwidthPublic: '500 Mbit/s',
    bandwidthPrivate: '4 Gbit/s max',
    mode: 'region-3-az',
    hourlyPrice: 0.0465,
    monthlyPrice: 25.5,
  };

  const gpuFlavor: TGpuFlavorData = {
    unavailable: false,
    unavailableQuota: false,
    name: 'A10-45',
    gpu: 'A-10',
    numberOfGpu: 1,
    vRamTotal: 24,
    memory: 45,
    vCore: 30,
    storage: '400 SSD',
    bandwidthPublic: '500 Mbit/s',
    bandwidthPrivate: '4 Gbit/s max',
    hourlyPrice: 0.76,
    monthlyPrice: 554.8,
  };

  describe('mapFlavorToTable', () => {
    it('should map from a standard flavor to TFlavorDataForTable', () => {
      const result = mapFlavorToTable(baseFlavor);

      expect(result).toEqual({
        unavailable: false,
        unavailableQuota: false,
        name: 'b3-8',
        memory: 8,
        vCore: 2,
        storage: '50NVMe',
        mode: 'region-3-az',
        hourlyPrice: 0.0465,
        monthlyPrice: 25.5,
      });
    });

    it('should not include bandwidthPublic and bandwidthPrivate properties', () => {
      const result = mapFlavorToTable(baseFlavor);
      expect(result).not.toHaveProperty('bandwidthPublic');
      expect(result).not.toHaveProperty('bandwidthPrivate');
    });
  });

  describe('mapGpuFlavorToTable', () => {
    it('should map a GPU flavor to TGpuFlavorDataForTable', () => {
      const result = mapGpuFlavorToTable(gpuFlavor);

      expect(result).toEqual({
        unavailable: false,
        unavailableQuota: false,
        name: 'A10-45',
        gpu: 'A-10',
        numberOfGpu: 1,
        vRamTotal: 24,
        memory: 45,
        vCore: 30,
        storage: '400 SSD',
        hourlyPrice: 0.76,
        monthlyPrice: 554.8,
      });
    });

    it('should not include bandwidthPublic and bandwidthPrivate properties', () => {
      const result = mapGpuFlavorToTable(gpuFlavor);
      expect(result).not.toHaveProperty('bandwidthPublic');
      expect(result).not.toHaveProperty('bandwidthPrivate');
    });
  });

  describe('mapFlavorToCart', () => {
    it('should map a standard flavor to TFlavorDataForCart', () => {
      const result = mapFlavorToCart(baseFlavor);

      expect(result).toEqual({
        name: 'b3-8',
        memory: 8,
        vCore: 2,
        storage: '50NVMe',
        bandwidthPublic: '500 Mbit/s',
        bandwidthPrivate: '4 Gbit/s max',
        numberOfGpu: undefined,
        vRamTotal: undefined,
      });
    });

    it('should map a GPU flavor to TFlavorDataForCart with GPU specific properties', () => {
      const result = mapFlavorToCart(gpuFlavor);

      console.log(result);
      console.log({
        name: 'A10-45',
        memory: 45,
        vCore: 30,
        storage: '400 SSD',
        bandwidthPublic: '500 Mbit/s',
        bandwidthPrivate: '4 Gbit/s max',
        numberOfGpu: 1,
        vRamTotal: 24,
      });

      expect(result).toEqual({
        name: 'A10-45',
        memory: 45,
        vCore: 30,
        storage: '400 SSD',
        bandwidthPublic: '500 Mbit/s',
        bandwidthPrivate: '4 Gbit/s max',
        gpu: 'A-10',
        numberOfGpu: 1,
        vRamTotal: 24,
      });
    });

    it("should return 'undefined' for the GPU properties of a standard flavor", () => {
      const result = mapFlavorToCart(baseFlavor);
      expect(result.numberOfGpu).toBeUndefined();
      expect(result.vRamTotal).toBeUndefined();
    });
  });
});
