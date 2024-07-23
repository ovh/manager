import React from 'react';
import { useTranslation } from 'react-i18next';

export type TRegionLabelProps = {
  code: string | null;
};

export default function RegionLabel(props: TRegionLabelProps) {
  const { t } = useTranslation('region');
  const key = props.code?.replaceAll('-', '_')?.toLocaleLowerCase();

  return <>{key ? t(`region_${key}`) : '-'}</>;
}
