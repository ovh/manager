import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ADedicatedServer() {
  const { t } = useTranslation('a-dedicated-server');

  return (
    <div>
      <h1>{t('title')}</h1>
      <div>Start your application</div>
    </div>
  );
}
