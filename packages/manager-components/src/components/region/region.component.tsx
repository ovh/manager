import { useTranslation } from 'react-i18next';
import './translations';

export interface RegionProps {
  mode: string;
  name: string;
  micro?: number;
}

export function Region({ mode = 'region', name, micro }: RegionProps) {
  const { t } = useTranslation('region');
  const key = name.replace(/-/g, '_')?.toLocaleLowerCase();

  return (
    <>
      {mode === 'region' ? t(`region_${key}`) : t(`region_${key}`, { micro })}
    </>
  );
}

export default Region;
