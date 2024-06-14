import { useTranslation } from 'react-i18next';

const units = [
  { value: 1024 ** 4, label: 'zimbra_emails_datagrid_quota_to' },
  { value: 1024 ** 3, label: 'zimbra_emails_datagrid_quota_go' },
  { value: 1024 ** 2, label: 'zimbra_emails_datagrid_quota_mo' },
  { value: 1024, label: 'zimbra_emails_datagrid_quota_ko' },
];

const formatValue = (
  value: number,
  unitValue: number,
  label: string,
): string => {
  const convertedValue =
    unitValue === 1 ? value.toString() : (value / unitValue).toFixed(2);
  return `${convertedValue} ${label}`;
};

export const convertOctets = (value: number): string => {
  const { t } = useTranslation('emails');

  const unit = units.find((u) => value >= u.value);
  const label = unit ? t(unit.label) : t('zimbra_emails_datagrid_quota_octets');
  const unitValue = unit ? unit.value : 1;

  return formatValue(value, unitValue, label);
};
