import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Dashboard(): JSX.Element {
  const { t } = useTranslation('dashboard');
  return (<div>{t('Dashboard')}</div>);
}
