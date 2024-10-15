import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PciAiEndpoints() {
  const { t } = useTranslation('pci-ai-endpoints');

  return (
    <div>
      <h1>{t('title')}</h1>
      <div>Start your application</div>
    </div>
  );
}
