import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';

export const useRegionName = () => {
  const { t } = useTranslation([NAMESPACES.REGION]);

  const translateRegionName = (region: string) =>
    t(`region_${region}`, { ns: NAMESPACES.REGION });

  return { translateRegionName };
};
