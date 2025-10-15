import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { getMacroRegion } from './useTranslatedMicroRegions.utils';

export const useTranslatedMicroRegions = () => {
  const { i18n, t } = useTranslation(NAMESPACES.REGION);

  return {
    translateMicroRegion: (region: string) => {
      const macro = getMacroRegion(region);
      if (i18n.exists(`region:region_${macro}_micro`)) {
        return t(`region_${macro}_micro`, { micro: region });
      }
      return '';
    },
    translateMacroRegion: (region: string) => {
      const macro = getMacroRegion(region);
      if (i18n.exists(`region:region_${macro}`)) {
        return t(`region_${macro}`);
      }
      return '';
    },
    translateContinentRegion: (region: string) => {
      const macro = getMacroRegion(region);
      if (i18n.exists(`region:region_continent_${macro}`)) {
        return t(`region_continent_${macro}`);
      }
      return '';
    },
  };
};
