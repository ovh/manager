import React from 'react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

type MonitoringStatusProps = {
  monitoring: boolean;
  noIntervention: boolean;
};

export const MonitoringStatusChip: React.FC<MonitoringStatusProps> = ({
  monitoring,
  noIntervention,
}) => {
  const { t } = useTranslation('dedicated-servers');
  const color = !monitoring ? ODS_BADGE_COLOR.warning : ODS_BADGE_COLOR.success;
  let label;
  if (!monitoring) {
    label = 'disabled';
  } else {
    label = noIntervention ? 'proactive' : 'no-proactive';
  }

  return (
    <OdsBadge
      label={t(`server_configuration_monitoring_status_${label}`)}
      color={color}
      className="mt-3"
    />
  );
};

export default MonitoringStatusChip;
