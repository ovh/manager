import React from 'react';
import { useTranslation } from 'react-i18next';

export default function WebDomainDnsOngoingOperations() {
  const { t } = useTranslation('web-domain-dns-ongoing-operations');

  return (
    <div>
      <h1>{t('title')}</h1>
      <div>Start your application</div>
    </div>
  );
}
