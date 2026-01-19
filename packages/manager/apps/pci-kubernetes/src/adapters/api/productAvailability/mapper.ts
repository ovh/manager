import { TMacroRegion, TMicroRegion, TRegions } from '@/domain/entities/regions';
import { isCountryCode } from '@/helpers/location';

import {
  TPlanCodeDTO,
  TProductAvailabilityPlanDTO,
  TProductAvailabilityRegionDTO,
  TProductAvailabilityResponseDTO,
} from './dto.types';

type RegionWithPlanCodes = TProductAvailabilityRegionDTO & {
  planCodes: Array<TPlanCodeDTO>;
};

const mapRegionDtoToMacroRegionEntity = (regionDTO: RegionWithPlanCodes): TMacroRegion => ({
  name: regionDTO.datacenter,
  countryCode: isCountryCode(regionDTO.countryCode) ? regionDTO.countryCode : null,
  continentCode: regionDTO.continentCode,
  enabled: regionDTO.enabled,
  microRegionIds: [regionDTO.name],
  plans: [...regionDTO.planCodes],
});

const mapRegionDtoToMicroRegionEntity = (regionDTO: RegionWithPlanCodes): TMicroRegion => ({
  name: regionDTO.name,
  macroRegionId: regionDTO.datacenter,
  enabled: regionDTO.enabled,
  availabilityZones: regionDTO.availabilityZones,
  deploymentMode: regionDTO.type,
});

const normalizeRegions = (
  regionsDto: Array<RegionWithPlanCodes>,
): Pick<TRegions['entities'], 'macroRegions' | 'microRegions'> => {
  const macroRegions = new Map<string, TMacroRegion>();
  const microRegions = new Map<string, TMicroRegion>();

  regionsDto.forEach((regionDto) => {
    microRegions.set(regionDto.name, mapRegionDtoToMicroRegionEntity(regionDto));

    const macroRegionId = regionDto.datacenter;
    const existingMacroRegion = macroRegions.get(macroRegionId);
    if (existingMacroRegion) {
      macroRegions.set(macroRegionId, {
        ...existingMacroRegion,
        microRegionIds: [...existingMacroRegion.microRegionIds, regionDto.name],
        enabled: existingMacroRegion.enabled || regionDto.enabled,
      });
    } else {
      macroRegions.set(macroRegionId, mapRegionDtoToMacroRegionEntity(regionDto));
    }
  });

  return {
    macroRegions: {
      byId: macroRegions,
      allIds: [...macroRegions.keys()],
    },
    microRegions: {
      byId: microRegions,
      allIds: [...microRegions.keys()],
    },
  };
};

const mergeRegionsWithPlanCodes = (
  plans: TProductAvailabilityPlanDTO[],
): [Map<string, RegionWithPlanCodes>, Record<string, string[]>] => {
  const allRegionsMap = new Map<string, RegionWithPlanCodes>();
  const planRegions: Record<string, string[]> = {};

  plans.forEach((plan) => {
    const regionIds: string[] = [];

    plan.regions.forEach((region: TProductAvailabilityRegionDTO) => {
      if (!allRegionsMap.has(region.name)) {
        allRegionsMap.set(region.name, { ...region, planCodes: [plan.code] });
      } else {
        const existingRegion = allRegionsMap.get(region.name);
        if (existingRegion) {
          allRegionsMap.set(region.name, {
            ...existingRegion,
            planCodes: [...existingRegion.planCodes, plan.code],
          });
        }
      }
      regionIds.push(region.name);
    });

    planRegions[plan.code] = regionIds;
  });

  return [allRegionsMap, planRegions];
};

export const mapProductAvailabilityToEntity = (
  responseDto: TProductAvailabilityResponseDTO,
): TRegions => {
  const [allRegionsMap, planRegions] = mergeRegionsWithPlanCodes(responseDto.plans);
  const normalizedEntities = normalizeRegions([...allRegionsMap.values()]);

  return {
    entities: normalizedEntities,
    relations: {
      planRegions,
    },
  };
};
