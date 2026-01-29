import { describe, expect, it, vi } from 'vitest';

import { TMacroRegion, TMicroRegion } from '@/domain/entities/catalog.entity';

import { mapDeploymentModeForCard, mapRegionToLocalizationCard } from '../shareCatalog.mapper';

// Mock SVG imports
vi.mock('../../../../public/assets/1AZ.svg', () => ({
  default: 'Region1azImage',
}));

vi.mock('../../../../public/assets/3AZ.svg', () => ({
  default: 'Region3azImage',
}));

vi.mock('../../../../public/assets/LZ.svg', () => ({
  default: 'LZImage',
}));

// Mock service functions
vi.mock('@/domain/services/catalog.service', () => ({
  getMicroRegions: (macroRegion: TMacroRegion, microRegionsById: Map<string, TMicroRegion>) =>
    macroRegion.microRegions
      .map((id) => microRegionsById.get(id))
      .filter((micro): micro is TMicroRegion => !!micro),
  isMicroRegionAvailable: (microRegion: TMicroRegion) =>
    microRegion.isActivated && !microRegion.isInMaintenance,
  isMacroRegionAvailable: (
    macroRegion: TMacroRegion,
    microRegionsById: Map<string, TMicroRegion>,
  ) => {
    const microRegions = macroRegion.microRegions
      .map((id) => microRegionsById.get(id))
      .filter((micro): micro is TMicroRegion => !!micro);
    return microRegions.some((m) => m.isActivated && !m.isInMaintenance);
  },
}));

describe('shareCatalog.mapper', () => {
  describe('mapDeploymentModeForCard', () => {
    it('should map deployment mode to card data', () => {
      const result = mapDeploymentModeForCard('region');

      expect(result).toEqual({
        mode: 'region',
        labelKey: 'localisation.deploymentMode.modes.region.label',
        descriptionKey: 'localisation.deploymentMode.modes.region.description',
        Image: '/public/assets/1AZ.svg',
      });
    });
  });

  describe('mapRegionToLocalizationCard', () => {
    it('should map macro region to localization card data', () => {
      const macroRegion: TMacroRegion = {
        name: 'GRA',
        deploymentMode: 'region',
        continentIds: ['Europe'],
        country: 'fr',
        microRegions: ['GRA1', 'GRA2'],
      };

      const microRegionsById = new Map<string, TMicroRegion>([
        [
          'GRA1',
          {
            name: 'GRA1',
            availabilityZones: ['GRA1-A'],
            isActivated: true,
            isActivable: true,
            isInMaintenance: false,
            macroRegionId: 'GRA',
          },
        ],
        [
          'GRA2',
          {
            name: 'GRA2',
            availabilityZones: ['GRA2-A'],
            isActivated: true,
            isActivable: true,
            isInMaintenance: false,
            macroRegionId: 'GRA',
          },
        ],
      ]);

      const result = mapRegionToLocalizationCard(microRegionsById)(macroRegion);

      expect(result).toMatchObject({
        cityKey: 'manager_components_region_GRA',
        macroRegion: 'GRA',
        deploymentMode: 'region',
        countryCode: 'fr',
        available: true,
        datacenterDetails: 'GRA',
        firstAvailableMicroRegion: 'GRA1',
      });
    });

    it('should return micro-region name as datacenterDetails when there is only one micro-region', () => {
      const macroRegion: TMacroRegion = {
        name: 'GRA',
        deploymentMode: 'region',
        continentIds: ['Europe'],
        country: 'fr',
        microRegions: ['GRA1'],
      };

      const microRegionsById = new Map<string, TMicroRegion>([
        [
          'GRA1',
          {
            name: 'GRA1',
            availabilityZones: ['GRA1-A'],
            isActivable: true,
            isActivated: true,
            isInMaintenance: false,
            macroRegionId: 'GRA',
          },
        ],
      ]);

      const result = mapRegionToLocalizationCard(microRegionsById)(macroRegion);

      expect(result).toMatchObject({
        cityKey: 'manager_components_region_GRA',
        macroRegion: 'GRA',
        deploymentMode: 'region',
        countryCode: 'fr',
        available: true,
        datacenterDetails: 'GRA1',
        firstAvailableMicroRegion: 'GRA1',
      });
    });

    it('should set firstAvailableMicroRegion to undefined when macro has no micro-regions', () => {
      const macroRegion: TMacroRegion = {
        name: 'GRA',
        deploymentMode: 'region',
        continentIds: ['Europe'],
        country: 'fr',
        microRegions: [],
      };

      const microRegionsById = new Map<string, TMicroRegion>();

      const result = mapRegionToLocalizationCard(microRegionsById)(macroRegion);

      expect(result.firstAvailableMicroRegion).toBeUndefined();
    });

    it('should return first available micro region when first in list is unavailable', () => {
      const macroRegion: TMacroRegion = {
        name: 'GRA',
        deploymentMode: 'region',
        continentIds: ['Europe'],
        country: 'fr',
        microRegions: ['GRA1', 'GRA2'],
      };

      const microRegionsById = new Map<string, TMicroRegion>([
        [
          'GRA1',
          {
            name: 'GRA1',
            availabilityZones: ['GRA1-A'],
            isActivated: false,
            isActivable: true,
            isInMaintenance: false,
            macroRegionId: 'GRA',
          },
        ],
        [
          'GRA2',
          {
            name: 'GRA2',
            availabilityZones: ['GRA2-A'],
            isActivated: true,
            isActivable: true,
            isInMaintenance: false,
            macroRegionId: 'GRA',
          },
        ],
      ]);

      const result = mapRegionToLocalizationCard(microRegionsById)(macroRegion);

      expect(result.firstAvailableMicroRegion).toBe('GRA2');
    });

    it('should set firstAvailableMicroRegion to undefined when no micro region is available', () => {
      const macroRegion: TMacroRegion = {
        name: 'GRA',
        deploymentMode: 'region',
        continentIds: ['Europe'],
        country: 'fr',
        microRegions: ['GRA1'],
      };

      const microRegionsById = new Map<string, TMicroRegion>([
        [
          'GRA1',
          {
            name: 'GRA1',
            availabilityZones: ['GRA1-A'],
            isActivated: false,
            isActivable: true,
            isInMaintenance: true,
            macroRegionId: 'GRA',
          },
        ],
      ]);

      const result = mapRegionToLocalizationCard(microRegionsById)(macroRegion);

      expect(result.firstAvailableMicroRegion).toBeUndefined();
    });
  });
});
