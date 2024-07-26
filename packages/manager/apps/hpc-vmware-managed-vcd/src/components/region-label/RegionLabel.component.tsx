import React from 'react';
import { useTranslation } from 'react-i18next';

export type TRegionLabelProps = {
  readonly code: string | null;
};
export default function RegionLabel({ code }: TRegionLabelProps): JSX.Element {
  const { t } = useTranslation('hpc-vmware-managed-vcd/region');

  if (!code) {
    return <>-</>;
  }
  const key = code.replaceAll('-', '_').toLocaleLowerCase();

  return <>{t(`region_${key}`)}</>;
}
