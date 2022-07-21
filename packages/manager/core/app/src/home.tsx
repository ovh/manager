import React from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { useEnvironment } from './core';

export default function Home() {
  const { t } = useTranslation('home');
  const env = useEnvironment();
  return (
    <div>
      <pre>{`${t('hello')} ${env.user.nichandle}`}</pre>
      <button onClick={() => i18next.changeLanguage('fr_FR')}>fr_FR</button>
      <button onClick={() => i18next.changeLanguage('en_GB')}>en_GB</button>
    </div>
  );
}
