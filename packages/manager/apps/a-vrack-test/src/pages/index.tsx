import React from 'react';
import { useTranslation } from 'react-i18next';

export default function AVrackTest() {
  const { t } = useTranslation('a-vrack-test');

  return (
    <div>
      <h1>{t('title')}</h1>
      <div>Start your application</div>
    </div>
  );
}
