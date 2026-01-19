import {
  TDeploymentModeDataForCard,
  TRegionData,
  TSVGImage,
} from '@/adapters/catalog/left/shareCatalog.data';
import { TDeploymentMode, TMacroRegion, TMicroRegion } from '@/domain/entities/catalog.entity';
import { getMicroRegions, isMacroRegionAvailable } from '@/domain/services/catalog.service';

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
      microRegion: getMicroRegionName(region, microRegionsById),
      countryCode: region.country,
      deploymentMode: region.deploymentMode,
      microRegions: getMicroRegions(region, microRegionsById),
      available: isMacroRegionAvailable(region, microRegionsById),
    };
  };
