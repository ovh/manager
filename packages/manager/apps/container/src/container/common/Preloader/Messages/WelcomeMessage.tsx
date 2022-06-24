import React from 'react';
import { useTranslation } from 'react-i18next';

const WelcomeMessage = (): JSX.Element => {
  const { t } = useTranslation('preloader');
  return (
    <>
      <p>{t('welcome_title')}</p>
      <h1>{t('welcome_subtitle')}</h1>
    </>
  );
};

export default WelcomeMessage;
