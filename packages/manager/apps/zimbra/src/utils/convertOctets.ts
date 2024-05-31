import { useTranslation } from 'react-i18next';

export const convertOctets = (value: number): string => {
  const { t } = useTranslation('emails');
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(1)} ${t(
      'zimbra_emails_datagrid_quota_to',
    )}`;
  }
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)} ${t(
      'zimbra_emails_datagrid_quota_go',
    )}`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)} ${t(
      'zimbra_emails_datagrid_quota_mo',
    )}`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)} ${t(
      'zimbra_emails_datagrid_quota_ko',
    )}`;
  }
  return `${value} ${t('zimbra_emails_datagrid_quota_octets')}`;
};
