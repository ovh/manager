import React from 'react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { DedicatedServer } from '@/data/types/server.type';

export const MonitoringStatusChip = (server: DedicatedServer) => {
  const { t } = useTranslation('dedicated-servers');
  const color = !server.monitoring
    ? ODS_BADGE_COLOR.warning
    : ODS_BADGE_COLOR.success;
  const getMonitoringStatusLabel = (
    _monitoring: boolean,
    _noIntervention: boolean,
  ) => {
    if (!_monitoring) return 'disabled';
    return _noIntervention ? 'proactive' : 'no-proactive';
  };

  return (
    <OdsBadge
      label={t(
        `server_configuration_monitoring_status_${getMonitoringStatusLabel(
          server.monitoring,
          server.noIntervention,
        )}`,
      )}
      color={color}
      className="mt-3"
    />
  );
};

export default MonitoringStatusChip;
