import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Onboarding() {
  const { t } = useTranslation('tuesday/onboarding');

  return (
    <div>
      <h1>{t('title')}</h1>
      <div>Onboarding page</div>
    </div>
  );
}
