import React from 'react';
import { useTranslation } from 'react-i18next';

type TRegion = {
  code: string;
};

export default function RegionLabel({ code }: TRegion) {
  const { t } = useTranslation('region');
  const key = code?.replaceAll('-', '_')?.toLocaleLowerCase();

  return <>{key ? t(`region_${key}`) : '-'}</>;
}
