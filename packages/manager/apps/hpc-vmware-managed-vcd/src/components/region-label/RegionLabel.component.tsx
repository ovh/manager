import React from 'react';
import { useTranslation } from 'react-i18next';

type TRegion = {
  code: string | null;
};

export default function RegionLabel({ code }: TRegion): JSX.Element {
  if (!code) {
    return <>-</>;
  }
  const { t } = useTranslation('region');
  const key = code.replaceAll('-', '_').toLocaleLowerCase();

  return <>{t(`region_${key}`)}</>;
}
