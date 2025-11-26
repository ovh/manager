import { BillingInfo } from '@/data/types/billing.type';

export const getVrackWording = (vrack?: string) => vrack || '-';

export const textByProductStatus: Record<string, string> = {
  ok: 'server_configuration_state_OK',
  hacked: 'server_configuration_state_HACKED',
  hackedBlocked: 'server_configuration_state_HACKED_BLOCKED',
};

const getMonitoringStatusLabel = (
  isMonitoring: boolean,
  hasNoIntervention: boolean,
) => {
  if (!isMonitoring) return 'disabled';
  if (hasNoIntervention) return 'no-proactive';
  return 'proactive';
};

export const monitoringStatusWording = (
  isMonitoring: boolean,
  hasNoIntervention: boolean,
) =>
  `server_configuration_monitoring_status_${getMonitoringStatusLabel(
    isMonitoring,
    hasNoIntervention,
  )}`;

export const getRenewWording = (billingInfos: BillingInfo) =>
  billingInfos?.billing?.renew?.current?.mode
    ? `server_display_renew-${billingInfos.billing.renew.current.mode}`
    : '-';

export const getTagsWording = ({
  tags = {},
}: {
  tags?: { [key: string]: string };
}) =>
  Object.keys(tags)
    .map((key: string) => `${key}:${tags[key]}`)
    .join(' | ');

export const getEngagementWording = (billingInfos: BillingInfo) =>
  `server_display_with${
    billingInfos?.billing?.engagement ? '' : 'out'
  }-engagement`;
