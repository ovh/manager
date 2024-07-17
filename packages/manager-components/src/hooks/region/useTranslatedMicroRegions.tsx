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
  const regionSubStrings = region.split('-');
  const macroRegionMap = [
    null,
    regionSubStrings[0].split(/(\d)/)[0],
    regionSubStrings[0],
    regionSubStrings[2],
    regionSubStrings[2] === 'LZ' ? regionSubStrings[3] : regionSubStrings[2],
    regionSubStrings[3],
  ];
  return macroRegionMap[regionSubStrings.length] || 'Unknown_Macro_Region';
};

export const useTranslatedMicroRegions = () => {
  const { i18n, t } = useTranslation('region');

  return {
    translateMicroRegion: (region: string) => {
      const macro = getMacroRegion(region);
      if (i18n.exists(`region:manager_components_region_${macro}_micro`)) {
        return t(`manager_components_region_${macro}_micro`, { micro: region });
      }
      return '';
    },
    translateMacroRegion: (region: string) => {
      const macro = getMacroRegion(region);
      if (i18n.exists(`region:manager_components_region_${macro}`)) {
        return t(`manager_components_region_${macro}`);
      }
      return '';
    },
    translateContinentRegion: (region: string) => {
      const macro = getMacroRegion(region);
      if (i18n.exists(`region:manager_components_region_continent_${macro}`)) {
        return t(`manager_components_region_continent_${macro}`);
      }
      return '';
    },
  };
};
