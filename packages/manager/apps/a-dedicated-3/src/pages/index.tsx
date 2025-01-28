import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ADedicated_3() {
  const { t } = useTranslation('a-dedicated-3');

  return (
    <div>
      <h1>{t('title')}</h1>
      <div>Start your application</div>
    </div>
  );
}
