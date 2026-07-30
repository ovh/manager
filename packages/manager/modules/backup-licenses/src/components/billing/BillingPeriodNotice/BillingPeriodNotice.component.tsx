import React from 'react';

import { useTranslation } from 'react-i18next';

import { format } from 'date-fns';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';

interface BillingPeriodNoticeProps {
  beginDate: string | null;
  endDate: string | null;
}

/**
 * Répond au commentaire Jira du 30/06 (« we need to precise if it's monthly or from the
 * beginning ») : affiche la période de facturation en cours au-dessus du tableau (§6 de
 * la spec BKP-1225). Variante sans dates si l'API ne les renvoie pas.
 */
export default function BillingPeriodNotice({ beginDate, endDate }: BillingPeriodNoticeProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.BILLING);

  if (!beginDate || !endDate) {
    return <OdsText preset={ODS_TEXT_PRESET.caption}>{t('period_notice_fallback')}</OdsText>;
  }

  const begin = format(new Date(beginDate), 'dd/MM/yyyy');
  const end = format(new Date(endDate), 'dd/MM/yyyy');
  const text = t('period_notice', { begin, end });
  const beginIndex = text.indexOf(begin);
  const endIndex = text.indexOf(end, beginIndex + begin.length);

  return (
    <OdsText preset={ODS_TEXT_PRESET.caption}>
      {text.slice(0, beginIndex)}
      <strong>{begin}</strong>
      {text.slice(beginIndex + begin.length, endIndex)}
      <strong>{end}</strong>
      {text.slice(endIndex + end.length)}
    </OdsText>
  );
}
