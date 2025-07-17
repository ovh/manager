import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SapFeaturesHub() {
  const { t } = useTranslation('sap-features-hub');

  return (
    <div>
      <h1>{t('title')}</h1>
      <div>Start your application</div>
    </div>
  );
}
