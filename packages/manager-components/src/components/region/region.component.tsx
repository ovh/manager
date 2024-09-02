import React from 'react';
import { useTranslation } from 'react-i18next';
import './translations/region';
import './translations/datacenter';

export interface RegionProps {
  mode: 'region' | 'datacenter';
  name: string;
  micro?: number;
}

export const Region: React.FC<RegionProps> = ({
  mode = 'region',
  name,
  micro,
}: RegionProps) => {
  const { t } = useTranslation(mode === 'region' ? 'region' : 'datacenter');

  return <>{t(`region_${name}`, { micro })}</>;
};
