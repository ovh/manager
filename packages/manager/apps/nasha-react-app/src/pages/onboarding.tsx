import React from 'react';
import { useTranslation } from 'react-i18next';

export default function NashaReactAppOnboarding() {
  const { t } = useTranslation('nasha-react-app/onboarding');

  return (
    <div>
      <h1>{t('title')}</h1>
    </div>
  );
}
