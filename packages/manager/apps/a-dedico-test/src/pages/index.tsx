import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ADedicoTest() {
  const { t } = useTranslation('a-dedico-test');

  return (
    <div>
      <h1>{t('title')}</h1>
      <div>Start your application</div>
    </div>
  );
}
