import React from 'react';
import { useTranslation } from 'react-i18next';

export default function AVrackServices() {
  const { t } = useTranslation('a-vrack-services');

  return (
    <div>
      <h1>{t('title')}</h1>
      <div>Start your application</div>
    </div>
  );
}
