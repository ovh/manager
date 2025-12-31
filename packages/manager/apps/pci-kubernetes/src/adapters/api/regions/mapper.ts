import { TMacroRegion, TMicroRegion, TRegions } from '@/domain/entities/regions';

import { TRegionDTO } from './dto.type';

const mapRegionDtoToMacroRegionEntity = (regionDTO: TRegionDTO): TMacroRegion => ({
  name: regionDTO.name,
  countryCode: regionDTO.countryCode,
  deploymentMode: regionDTO.type,
  continentCode: regionDTO.continentCode,
  availabilityZones: regionDTO.availabilityZones,
  disabled: regionDTO.status !== 'UP',
  microRegionIds: [],
});

const mapRegionDtoToMicroRegionEntity = (regionDTO: TRegionDTO): TMicroRegion => ({
  name: regionDTO.name,
  ipCountries: regionDTO.ipCountries,
  macroRegionId: regionDTO.datacenterLocation,
  services: regionDTO.services,
});

const normalizeRegions = (
  regionsDto: Array<TRegionDTO>,
): Pick<TRegions['entities'], 'macroRegions' | 'microRegions'> => {
  const macroRegions = new Map<string, TMacroRegion>();
  const microRegions = new Map<string, TMicroRegion>();
  const microRegionDtos: TRegionDTO[] = [];

  regionsDto.forEach((regionDto) => {
    const macroRegionId = regionDto.datacenterLocation;
    const isMicroRegion = regionDto.name !== macroRegionId;

    if (!macroRegions.has(macroRegionId)) {
      macroRegions.set(macroRegionId, mapRegionDtoToMacroRegionEntity(regionDto));
    }

    if (isMicroRegion) {
      const macroRegion = macroRegions.get(macroRegionId)!;
      macroRegion.microRegionIds.push(regionDto.name);
      microRegionDtos.push(regionDto);
    }
  });

  microRegionDtos.forEach((regionDto) => {
    microRegions.set(regionDto.name, mapRegionDtoToMicroRegionEntity(regionDto));
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

export const mapRegionsToEntity = (regionsDto: Array<TRegionDTO>): TRegions => {
  return {
    entities: {
      ...normalizeRegions(regionsDto),
    },
  };
};
