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
  getMicroRegions: (macroRegion: TMacroRegion) => {
    return macroRegion.microRegions.map((id) => ({
      name: `micro-${id}`,
      availabilityZones: ['zone1'],
      isActivable: true,
      isInMaintenance: false,
    }));
  },
  isMacroRegionAvailable: (macroRegion: TMacroRegion) => {
    return macroRegion.microRegions.length > 0;
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
      });
    });
  });
});
