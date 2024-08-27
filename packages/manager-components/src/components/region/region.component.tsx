import { useTranslation } from 'react-i18next';
import './translations/region';
import './translations/datacenter';

export interface RegionProps {
  mode: string;
  name: string;
  micro?: number;
}

export function Region({ mode = 'region', name, micro }: RegionProps) {
  const { t } = useTranslation(mode === 'region' ? 'region' : 'datacenter');
  const key = name.replace(/-/g, '_')?.toLocaleLowerCase();

  return (
    <>
      {mode === 'region' ? t(`region_${key}`) : t(`region_${key}`, { micro })}
    </>
  );
}

export default Region;
