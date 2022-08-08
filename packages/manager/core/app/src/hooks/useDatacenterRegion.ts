import { useTranslation } from 'react-i18next';

export default function useDatacenterRegion(region: string) {
  const { t } = useTranslation('common');
  const [, localisation, number] = (region || '').match(/([^0-9]+)([0-9]*)/);
  return {
    label: t(`dc_region_${localisation}`, { number }),
  };
}
