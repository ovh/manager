import {
  TDeploymentModeDataForCard,
  TRegionData,
  TSVGImage,
  TShareSpecData,
} from '@/adapters/catalog/left/shareCatalog.data';
import {
  TDeploymentMode,
  TMacroRegion,
  TMicroRegion,
  TShareSpecs,
} from '@/domain/entities/catalog.entity';
import {
  getMicroRegions,
  isMacroRegionAvailable,
  isMicroRegionAvailable,
} from '@/domain/services/catalog.service';

import Region1azImage from '../../../../public/assets/1AZ.svg';
import Region3azImage from '../../../../public/assets/3AZ.svg';
import LZImage from '../../../../public/assets/LZ.svg';

const getImage = (mode: TDeploymentMode) => {
  switch (mode) {
    case 'region-3-az':
      return Region3azImage;
    case 'region':
      return Region1azImage;
    default:
      return LZImage;
  }
};

export const mapDeploymentModeForCard = (mode: TDeploymentMode): TDeploymentModeDataForCard => ({
  mode,
  labelKey: `localisation.deploymentMode.modes.${mode}.label`,
  descriptionKey: `localisation.deploymentMode.modes.${mode}.description`,
  Image: getImage(mode) as unknown as TSVGImage,
});

const getLocalZoneTranslationKey = (regionName: string) => regionName.split('-').slice(-1)[0];

const getRegionNameKey = (deploymentMode: TDeploymentMode, name: string) =>
  deploymentMode === 'localzone' ? getLocalZoneTranslationKey(name) : name;

const getMicroRegionName = (region: TMacroRegion, microRegionsById: Map<string, TMicroRegion>) => {
  if (!region.microRegions[0]) return null;
  return microRegionsById.get(region.microRegions[0])?.name ?? null;
};

const getFirstAvailableMicroRegion = (
  region: TMacroRegion,
  microRegionsById: Map<string, TMicroRegion>,
): string | undefined => {
  const microRegions = getMicroRegions(region, microRegionsById);
  const firstAvailable = microRegions.find(isMicroRegionAvailable);
  return firstAvailable?.name;
};

const getDatacenterDetails = (region: TMacroRegion, microRegionsById: Map<string, TMicroRegion>) =>
  region.microRegions.length > 1 ? region.name : getMicroRegionName(region, microRegionsById);

export const mapRegionToLocalizationCard =
  (microRegionsById: Map<string, TMicroRegion>) =>
  (region: TMacroRegion): TRegionData => {
    const regionName = getRegionNameKey(region.deploymentMode, region.name);

    return {
      cityKey: `manager_components_region_${regionName}`,
      datacenterDetails: getDatacenterDetails(region, microRegionsById),
      macroRegion: region.name,
      countryCode: region.country,
      deploymentMode: region.deploymentMode,
      available: isMacroRegionAvailable(region, microRegionsById),
      firstAvailableMicroRegion: getFirstAvailableMicroRegion(region, microRegionsById),
    };
  };

export const mapShareSpecsToShareSpecData = (spec: TShareSpecs): TShareSpecData => ({
  name: spec.name,
  capacityMin: spec.capacity.min,
  capacityMax: spec.capacity.max,
  iopsLevel: spec.iops.level,
  iopsMax: spec.iops.max,
  iopsGuaranteed: spec.iops.guaranteed,
  iopsUnit: spec.iops.unit,
  iopsMaxUnit: spec.iops.maxUnit,
  bandwidthLevel: spec.bandwidth.level,
  bandwidthMin: spec.bandwidth.min,
  bandwidthMax: spec.bandwidth.max,
  bandwidthUnit: spec.bandwidth.unit,
  bandwidthGuaranteed: spec.bandwidth.guaranteed,
  bandwidthMaxUnit: spec.bandwidth.maxUnit,
  microRegionIds: spec.microRegionIds,
  price: spec.pricing.price,
  priceInterval: spec.pricing.interval,
});

export const mapShareSpecDataToShareSpecs = (data: TShareSpecData): TShareSpecs => ({
  name: data.name,
  microRegionIds: data.microRegionIds,
  capacity: { min: data.capacityMin, max: data.capacityMax },
  pricing: { price: data.price, interval: data.priceInterval },
  iops: {
    level: data.iopsLevel,
    max: data.iopsMax,
    guaranteed: data.iopsGuaranteed,
    unit: data.iopsUnit,
    maxUnit: data.iopsMaxUnit,
  },
  bandwidth: {
    level: data.bandwidthLevel,
    min: data.bandwidthMin,
    max: data.bandwidthMax,
    unit: data.bandwidthUnit,
    guaranteed: data.bandwidthGuaranteed,
    maxUnit: data.bandwidthMaxUnit,
  },
});
