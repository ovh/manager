import React from 'react';
import { useTranslation } from 'react-i18next';

export default function HpcVmwareCloudDirector() {
  const { t } = useTranslation('hpc-vmware-managed-vcd');

  return (
    <div>
      <h1>{t('title')}</h1>
      <div>Start your application</div>
    </div>
  );
}
