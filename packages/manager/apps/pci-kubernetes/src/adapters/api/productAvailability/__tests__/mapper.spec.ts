import { describe, expect, it } from 'vitest';

import { TProductAvailabilityResponseDTO } from '../dto.types';
import { mapProductAvailabilityToEntity } from '../mapper';

describe('mapper', () => {
  describe('mapProductAvailabilityToEntity', () => {
    it('maps a single region with a single plan correctly', () => {
      const mockDto: TProductAvailabilityResponseDTO = {
        plans: [
          {
            code: 'mks.free.hour.consumption',
            regions: [
              {
                name: 'GRA9',
                datacenter: 'GRA',
                continentCode: 'EU',
                countryCode: 'fr',
                enabled: true,
                type: 'region',
                availabilityZones: ['GRA9-1', 'GRA9-2'],
              },
            ],
          },
        ],
      };

      const result = mapProductAvailabilityToEntity(mockDto);

      expect(result.entities.macroRegions.allIds).toEqual(['GRA']);
      expect(result.entities.microRegions.allIds).toEqual(['GRA9']);

      const macroRegion = result.entities.macroRegions.byId.get('GRA');
      expect(macroRegion).toEqual({
        name: 'GRA',
        countryCode: 'fr',
        continentCode: 'EU',
        enabled: true,
        microRegionIds: ['GRA9'],
        plans: ['mks.free.hour.consumption'],
      });

      const microRegion = result.entities.microRegions.byId.get('GRA9');
      expect(microRegion).toEqual({
        name: 'GRA9',
        macroRegionId: 'GRA',
        enabled: true,
        deploymentMode: 'region',
        availabilityZones: ['GRA9-1', 'GRA9-2'],
      });

      expect(result.relations.planRegions['mks.free.hour.consumption']).toEqual(['GRA9']);
    });

    it('merges multiple micro-regions into a single macro-region and sets enabled to true if at least one micro-region is enabled', () => {
      const mockDto: TProductAvailabilityResponseDTO = {
        plans: [
          {
            code: 'mks.free.hour.consumption',
            regions: [
              {
                name: 'GRA9',
                datacenter: 'GRA',
                continentCode: 'EU',
                countryCode: 'fr',
                enabled: true,
                type: 'region',
                availabilityZones: ['GRA9-1'],
              },
              {
                name: 'GRA11',
                datacenter: 'GRA',
                continentCode: 'EU',
                countryCode: 'fr',
                enabled: false,
                type: 'region',
                availabilityZones: ['GRA11-1'],
              },
            ],
          },
        ],
      };

      const result = mapProductAvailabilityToEntity(mockDto);

      expect(result.entities.macroRegions.allIds).toEqual(['GRA']);
      expect(result.entities.microRegions.allIds).toEqual(['GRA9', 'GRA11']);

      const macroRegion = result.entities.macroRegions.byId.get('GRA');
      expect(macroRegion).toMatchObject({
        microRegionIds: ['GRA9', 'GRA11'],
        enabled: true,
      });
    });

    it('aggregates multiple plan codes for the same region', () => {
      const mockDto: TProductAvailabilityResponseDTO = {
        plans: [
          {
            code: 'mks.free.hour.consumption',
            regions: [
              {
                name: 'GRA9',
                datacenter: 'GRA',
                continentCode: 'EU',
                countryCode: 'fr',
                enabled: true,
                type: 'region',
                availabilityZones: ['GRA9-1'],
              },
            ],
          },
          {
            code: 'mks.standard.hour.consumption',
            regions: [
              {
                name: 'GRA9',
                datacenter: 'GRA',
                continentCode: 'EU',
                countryCode: 'fr',
                enabled: true,
                type: 'region',
                availabilityZones: ['GRA9-1'],
              },
            ],
          },
        ],
      };

      const result = mapProductAvailabilityToEntity(mockDto);

      const macroRegion = result.entities.macroRegions.byId.get('GRA');
      expect(macroRegion?.plans).toEqual([
        'mks.free.hour.consumption',
        'mks.standard.hour.consumption',
      ]);

      expect(result.relations.planRegions['mks.free.hour.consumption']).toEqual(['GRA9']);
      expect(result.relations.planRegions['mks.standard.hour.consumption']).toEqual(['GRA9']);
    });

    it('handles disabled regions correctly', () => {
      const mockDto: TProductAvailabilityResponseDTO = {
        plans: [
          {
            code: 'mks.free.hour.consumption',
            regions: [
              {
                name: 'GRA9',
                datacenter: 'GRA',
                continentCode: 'EU',
                countryCode: 'fr',
                enabled: false,
                type: 'region',
                availabilityZones: ['GRA9-1'],
              },
            ],
          },
        ],
      };

      const result = mapProductAvailabilityToEntity(mockDto);

      const macroRegion = result.entities.macroRegions.byId.get('GRA');
      expect(macroRegion?.enabled).toBe(false);

      const microRegion = result.entities.microRegions.byId.get('GRA9');
      expect(microRegion?.enabled).toBe(false);
    });

    it('handles invalid country codes by setting them to null', () => {
      const mockDto: TProductAvailabilityResponseDTO = {
        plans: [
          {
            code: 'mks.free.hour.consumption',
            regions: [
              {
                name: 'GRA9',
                datacenter: 'GRA',
                continentCode: 'EU',
                countryCode: 'invalid-code',
                enabled: true,
                type: 'region',
                availabilityZones: ['GRA9-1'],
              },
            ],
          },
        ],
      };

      const result = mapProductAvailabilityToEntity(mockDto);

      const macroRegion = result.entities.macroRegions.byId.get('GRA');
      expect(macroRegion?.countryCode).toBeNull();
    });

    it('handles 3az deployment mode correctly', () => {
      const mockDto: TProductAvailabilityResponseDTO = {
        plans: [
          {
            code: 'mks.standard.hour.consumption.3az',
            regions: [
              {
                name: 'GRA9',
                datacenter: 'GRA',
                continentCode: 'EU',
                countryCode: 'fr',
                enabled: true,
                type: 'region-3-az',
                availabilityZones: ['GRA9-1', 'GRA9-2', 'GRA9-3'],
              },
            ],
          },
        ],
      };

      const result = mapProductAvailabilityToEntity(mockDto);

      const microRegion = result.entities.microRegions.byId.get('GRA9');
      expect(microRegion?.deploymentMode).toBe('region-3-az');
      expect(microRegion?.availabilityZones).toEqual(['GRA9-1', 'GRA9-2', 'GRA9-3']);
    });

    it('handles multiple macro-regions correctly', () => {
      const mockDto: TProductAvailabilityResponseDTO = {
        plans: [
          {
            code: 'mks.free.hour.consumption',
            regions: [
              {
                name: 'GRA9',
                datacenter: 'GRA',
                continentCode: 'EU',
                countryCode: 'fr',
                enabled: true,
                type: 'region',
                availabilityZones: ['GRA9-1'],
              },
              {
                name: 'SBG5',
                datacenter: 'SBG',
                continentCode: 'EU',
                countryCode: 'fr',
                enabled: true,
                type: 'region',
                availabilityZones: ['SBG5-1'],
              },
            ],
          },
        ],
      };

      const result = mapProductAvailabilityToEntity(mockDto);

      expect(result.entities.macroRegions.allIds).toEqual(['GRA', 'SBG']);
      expect(result.entities.microRegions.allIds).toEqual(['GRA9', 'SBG5']);

      const graMacro = result.entities.macroRegions.byId.get('GRA');
      expect(graMacro?.microRegionIds).toEqual(['GRA9']);

      const sbgMacro = result.entities.macroRegions.byId.get('SBG');
      expect(sbgMacro?.microRegionIds).toEqual(['SBG5']);
    });

    it('handles empty plans array', () => {
      const mockDto: TProductAvailabilityResponseDTO = {
        plans: [],
      };

      const result = mapProductAvailabilityToEntity(mockDto);

      expect(result.entities.macroRegions.allIds).toEqual([]);
      expect(result.entities.microRegions.allIds).toEqual([]);
      expect(Object.keys(result.relations.planRegions)).toEqual([]);
    });

    it('handles localzone deployment mode', () => {
      const mockDto: TProductAvailabilityResponseDTO = {
        plans: [
          {
            code: 'mks.free.hour.consumption',
            regions: [
              {
                name: 'GRA9',
                datacenter: 'GRA',
                continentCode: 'EU',
                countryCode: 'fr',
                enabled: true,
                type: 'localzone',
                availabilityZones: ['GRA9-1'],
              },
            ],
          },
        ],
      };

      const result = mapProductAvailabilityToEntity(mockDto);

      const microRegion = result.entities.microRegions.byId.get('GRA9');
      expect(microRegion?.deploymentMode).toBe('localzone');
    });
  });
});
