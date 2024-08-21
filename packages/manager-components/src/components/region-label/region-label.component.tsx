import { useTranslation } from 'react-i18next';
import './translations';

export interface RegionLabelProps {
  mode: string;
  name: string;
  micro: number;
}

export function RegionLabel({
  mode = 'region',
  name,
  micro,
}: RegionLabelProps) {
  const { t } = useTranslation('regionLabel');
  const key = name.replace(/-/g, '_')?.toLocaleLowerCase();

  return (
    <>
      {mode === 'region' ? t(`region_${key}`) : t(`region_${key}`, { micro })}
    </>
  );
}

export default RegionLabel;
