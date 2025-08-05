import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

const getMacroRegion = (region: string): string => {
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

export const useRegionTranslation = () => {
  const { i18n, t } = useTranslation('region');

  return {
    translateMicroRegion: useCallback(
      (region: string) => {
        const macro = getMacroRegion(region);
        if (i18n.exists(`region:manager_components_region_${macro}_micro`)) {
          return t(`manager_components_region_${macro}_micro`, { micro: region });
        }
        return '';
      },
      [t, i18n],
    ),
  };
};
