import { useTranslation } from 'react-i18next';
import './translations';

export const isLocalZone = (region: string) => {
  const localZonePattern = /^lz/i;
  return localZonePattern.test(
    region
      .split('-')
      ?.slice(2)
      ?.join('-'),
  );
};

export const getMacroRegion = (region: string): string => {
  let macro: RegExpExecArray;
  if (isLocalZone(region)) {
    // The pattern for local zone is <geo_location>-LZ-<datacenter>-<letter>
    // geo_location is EU-WEST, EU-SOUTH, maybe ASIA-WEST in the future
    // datacenter: MAD, BRU
    macro = /[\D]{2,3}/.exec(
      region
        .split('-')
        ?.slice(3)
        ?.join('-'),
    );
  } else {
    macro = /\D{2,3}/.exec(region);
  }
  return macro ? macro[0].replace('-', '').toUpperCase() : '';
};

export const useTranslatedMicroRegions = () => {
  const { t } = useTranslation('region');

  return {
    translateRegion: (region: string) =>
      t(`manager_components_region_${getMacroRegion(region)}_micro`, {
        micro: region,
      }),
  };
};
