import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CdnReactOnboarding() {
  const { t } = useTranslation('cdn-react/onboarding');

  return (
    <div>
      <h1>{t('title')}</h1>
    </div>
  );
}
