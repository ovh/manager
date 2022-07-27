import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Listing(): JSX.Element {
  const { t } = useTranslation('listing');
  return (<div>{t('Listing')}</div>);
}
