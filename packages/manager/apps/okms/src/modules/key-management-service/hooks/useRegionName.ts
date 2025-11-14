import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';

export const useRegionName = () => {
  const { t } = useTranslation(['common', NAMESPACES.REGION]);

  const translateRegionName = (region: string) =>
    t(`region_${region}`, { ns: NAMESPACES.REGION });

  const translateGeographyName = (geographyCode: string) =>
    t(`region_continent_${geographyCode}`, { ns: 'common' });

  return { translateRegionName, translateGeographyName };
};
