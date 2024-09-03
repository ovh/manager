import { ovhLocaleToI18next } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';

export const useFormattedDate = (dateString: string) => {
  const { t, i18n } = useTranslation('veeam-backup');
  const date = new Date(dateString);
  const locale = ovhLocaleToI18next(i18n?.language);

  return date.toString() === 'Invalid Date'
    ? t('unknown_date')
    : date.toLocaleString(locale || 'FR-fr', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
};
