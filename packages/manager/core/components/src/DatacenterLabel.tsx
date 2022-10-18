import React from 'react';
import { useTranslation } from 'react-i18next';

export type DatacenterLabelProps = {
  datacenterId: string;
};

export default function DatacenterLabel({
  datacenterId,
}: DatacenterLabelProps): JSX.Element {
  const { t } = useTranslation('common');
  const [region, number] = datacenterId.split('_');
  return <>{t(`server_datacenter_${region}`, { number })}</>;
}
