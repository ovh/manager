import React from 'react';
import { useTranslation } from 'react-i18next';

export default function WebOffice_365() {
  const { t } = useTranslation('web-office-365');

  return (
    <div>
      <h1>{t('title')}</h1>
      <div>Start your application</div>
    </div>
  );
}
