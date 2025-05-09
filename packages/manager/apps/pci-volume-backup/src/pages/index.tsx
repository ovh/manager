import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PciVolumeBackup() {
  const { t } = useTranslation('pci-volume-backup');

  return (
    <div>
      <h1>{t('title')}</h1>
      <div>Start your application</div>
    </div>
  );
}
