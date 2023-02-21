import React from 'react';
import { useTranslation } from 'react-i18next';

export default function NashaReactOnboarding() {
  const { t } = useTranslation('nasha-react/onboarding');

  return (
    <div>
      <h1>{t('title')}</h1>
    </div>
  );
}
