import { Deps } from '@/deps/deps';
import { TDeploymentMode } from '@/types/instance/common.type';
import { TMicroRegion, TMacroRegion } from '@/domain/entities/instancesCatalog';
import { Reader } from '@/types/utils.type';
import { TCountryIsoCode } from '@/components/flag/country-iso-code';
import { getLocalZoneTranslationKey } from '@/utils';
import { MessageProviderPort } from '@/domain/port/messageProvider/left/port';

const MAX_DISPLAYED_LOCALIZATIONS = 12;

type TMicroRegionDataForCard = {
  name: string;
  availabilityZones: string[];
  isActivable: boolean;
  isInMaintenance: boolean;
};

export type TRegionData = {
  city: string;
  datacenterDetails: string | null;
  macroRegion: string | null;
  microRegion: string | null;
  deploymentMode: TDeploymentMode;
  countryCode: TCountryIsoCode | null;
  microRegions: TMicroRegionDataForCard[];
};

export const getRegionNameKey = (
  deploymentMode: TDeploymentMode,
  name: string,
) => (deploymentMode === 'localzone' ? getLocalZoneTranslationKey(name) : name);

const getMicroRegionName = (
  region: TMacroRegion,
  microRegionsById: Map<string, TMicroRegion>,
) => {
  if (!region.microRegions[0]) return null;
  return microRegionsById.get(region.microRegions[0])?.name ?? null;
};

const getDatacenterDetails = (
  region: TMacroRegion,
  microRegionsById: Map<string, TMicroRegion>,
) =>
  region.microRegions.length > 1
    ? region.name
    : getMicroRegionName(region, microRegionsById);

const getMicroRegions = (
  region: TMacroRegion,
  microRegionsById: Map<string, TMicroRegion>,
) =>
  region.microRegions.flatMap((regionId) => {
    const microRegion = microRegionsById.get(regionId);
    return microRegion ? [microRegion] : [];
  });

const mapRegionToLocalizationCard = (
  microRegionsById: Map<string, TMicroRegion>,

  getMessageFn: MessageProviderPort['getMessage'],
) => (region: TMacroRegion): TRegionData => {
  const regionName = getRegionNameKey(region.deploymentMode, region.name);

  return {
    city: getMessageFn(`regions:manager_components_region_${regionName}`),
    datacenterDetails: getDatacenterDetails(region, microRegionsById),
    macroRegion: region.name,
    microRegion: getMicroRegionName(region, microRegionsById),
    countryCode: region.country,
    deploymentMode: region.deploymentMode,
    microRegions: getMicroRegions(region, microRegionsById),
  };
};

export type TRegionDataForCard = {
  localizations: TRegionData[];
  hasMoreLocalizations: boolean;
};

const getLocalizationsPart = (
  localizations: TRegionData[],
  selectedMacroRegionId: string | null,
) => {
  const localizationsPartToDisplay = localizations.slice(
    0,
    MAX_DISPLAYED_LOCALIZATIONS,
  );

  const selectedLocalization = localizations.find(
    (localization) => localization.macroRegion === selectedMacroRegionId,
  );

  const isSelectedLocalizationInHiddenResults =
    !!selectedLocalization &&
    !localizationsPartToDisplay.includes(selectedLocalization);

  return isSelectedLocalizationInHiddenResults
    ? [
        selectedLocalization,
        ...localizations.slice(0, MAX_DISPLAYED_LOCALIZATIONS - 1),
      ]
    : localizationsPartToDisplay;
};

// eslint-disable-next-line max-params
type TSelectLocalizationsData = (
  projectId: string,
  deploymentMode: TDeploymentMode[],
  continentId: string,
  display: 'partial' | 'total',
  selectedMacroRegionId: string | null,
) => TRegionDataForCard;

const emptyLocalizations = {
  localizations: [],
  hasMoreLocalizations: false,
};

export const selectLocalizations: Reader<Deps, TSelectLocalizationsData> = (
  deps,
) => (
  projectId,
  deploymentModes,
  continentId,
  display,
  selectedMacroRegionId,
  // eslint-disable-next-line max-params
) => {
  const { messageProviderPort, instancesCatalogPort } = deps;
  const data = instancesCatalogPort.selectInstancesCatalog(projectId);

  if (!data) return emptyLocalizations;

  const macroRegionsIds =
    continentId === 'all'
      ? data.entities.macroRegions.allIds
      : data.entities.continents.byId.get(continentId)?.datacenterIds;

  if (!macroRegionsIds) return emptyLocalizations;

  const matchingContinentAndDeploymentModeRegions = macroRegionsIds.reduce(
    (acc, macroRegionId): TMacroRegion[] => {
      const foundMacroRegion = data.entities.macroRegions.byId.get(
        macroRegionId,
      );
      if (!foundMacroRegion) return acc;
      if (
        !deploymentModes.length ||
        deploymentModes.includes(foundMacroRegion.deploymentMode)
      )
        acc.push(foundMacroRegion);
      return acc;
    },
    [] as TMacroRegion[],
  );

  const localizations = matchingContinentAndDeploymentModeRegions.map(
    mapRegionToLocalizationCard(
      data.entities.microRegions.byId,
      messageProviderPort.getMessage,
    ),
  );

  return {
    localizations:
      display === 'total'
        ? localizations
        : getLocalizationsPart(localizations, selectedMacroRegionId),
    hasMoreLocalizations: localizations.length > MAX_DISPLAYED_LOCALIZATIONS,
  };
};
