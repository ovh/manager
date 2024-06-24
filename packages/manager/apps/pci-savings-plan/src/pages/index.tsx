import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PciSavingsPlan() {
  const { t } = useTranslation('pci-savings-plan');

  return (
    <div>
      <h1>{t('title')}</h1>
      <div>Start your application</div>
    </div>
  );
}
