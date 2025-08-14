import React from 'react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { DedicatedServer } from '@/data/types/server.type';

const getMonitoringStatusLabel = (
  isMonitoring: boolean,
  hasNoIntervention: boolean,
) => {
  if (!isMonitoring) return 'disabled';
  if (hasNoIntervention) return 'no-proactive';
  return 'proactive';
};
const getMonitoringStatusColor = (
  isMonitoring: boolean,
  hasNoIntervention: boolean,
) => {
  if (!isMonitoring) return ODS_BADGE_COLOR.warning;
  if (hasNoIntervention) return ODS_BADGE_COLOR.warning;
  return ODS_BADGE_COLOR.success;
};

export const MonitoringStatusChip = (server: DedicatedServer) => {
  const { t } = useTranslation('dedicated-servers');

  return (
    <OdsBadge
      label={t(
        `server_configuration_monitoring_status_${getMonitoringStatusLabel(
          server.monitoring,
          server.noIntervention,
        )}`,
      )}
      color={getMonitoringStatusColor(server.monitoring, server.noIntervention)}
      className="mt-3"
    />
  );
};

export default MonitoringStatusChip;
