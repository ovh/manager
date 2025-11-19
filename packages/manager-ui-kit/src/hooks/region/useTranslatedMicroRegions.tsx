import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { getMacroRegion } from '@/hooks/region/Regions.utils';

export const useTranslatedMicroRegions = () => {
  const { i18n, t } = useTranslation(NAMESPACES.REGION);

  return {
    translateMicroRegion: (region: string) => {
      const macro = getMacroRegion(region)?.toUpperCase();
      if (i18n.exists(`${NAMESPACES.REGION}:region_${macro}_micro`)) {
        return t(`${NAMESPACES.REGION}:region_${macro}_micro`, { micro: region });
      }
      return '';
    },
    translateMacroRegion: (region: string) => {
      const macro = getMacroRegion(region)?.toUpperCase();
      if (i18n.exists(`${NAMESPACES.REGION}:region_${macro}`)) {
        return t(`${NAMESPACES.REGION}:region_${macro}`);
      }
      return '';
    },
    translateContinentRegion: (region: string) => {
      const macro = getMacroRegion(region)?.toUpperCase();
      if (i18n.exists(`${NAMESPACES.REGION}:region_continent_${macro}`)) {
        return t(`${NAMESPACES.REGION}:region_continent_${macro}`);
      }
      return '';
    },
  };
};
