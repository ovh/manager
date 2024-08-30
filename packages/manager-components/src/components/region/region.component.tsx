import { useTranslation } from 'react-i18next';
import './translations/region';
import './translations/datacenter';

export interface RegionProps {
  mode: 'region' | 'datacenter';
  name: string;
  micro?: number;
}

export function Region({ mode = 'region', name, micro }: RegionProps) {
  const { t } = useTranslation(mode === 'region' ? 'region' : 'datacenter');

  return <>{t(`region_${name}`, { micro })}</>;
}

export default Region;
