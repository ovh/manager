import React from 'react';
import { useTranslation } from 'react-i18next';

export default function IdentityAccessManagement() {
  const { t } = useTranslation('identity-access-management');

  return (
    <div>
      <h1>{t('title')}</h1>
      <div>Start your application</div>
    </div>
  );
}
