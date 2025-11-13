import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('regions');

  return {
    translateMicroRegion: (region: string) => {
      const macro = getMacroRegion(region);
      return t(`region_${macro}_micro`, macro, { micro: region });
    },
    translateMacroRegion: (region: string) => {
      const macro = getMacroRegion(region);
      return t(`region_${macro}`, macro);
    },
    translateContinentRegion: (region: string) => {
      const macro = getMacroRegion(region);
      return t(`region_continent_${macro}`, macro);
    },
  };
};
