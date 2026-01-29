import { useTranslation } from 'react-i18next';
import { Text, Card, Badge } from '@ovhcloud/ods-react';
import type { TVpsOptions, TVpsOptionStatus } from '@/domain/entities/options';

type TVpsOptionsTileProps = {
  options: TVpsOptions;
};

const statusToColor = (
  status: TVpsOptionStatus,
): 'success' | 'critical' | 'warning' | 'information' => {
  switch (status) {
    case 'enabled':
      return 'success';
    case 'disabled':
      return 'critical';
    case 'pending':
      return 'warning';
    case 'error':
      return 'critical';
    default:
      return 'information';
  }
};

export const VpsOptionsTile = ({ options }: TVpsOptionsTileProps) => {
  const { t } = useTranslation('vps');

  const optionsList = [
    {
      label: t('vps_dashboard_options_snapshot'),
      status: options.snapshot,
    },
    {
      label: t('vps_dashboard_options_veeam'),
      status: options.veeam,
    },
    {
      label: t('vps_dashboard_options_backup_storage'),
      status: options.backupStorage,
    },
  ];

  return (
    <Card className="p-6">
      <Text preset="heading-4" className="mb-4">
        {t('vps_dashboard_options_tile_title')}
      </Text>

      <div className="space-y-3">
        {optionsList.map((option) => (
          <div key={option.label} className="flex items-center justify-between">
            <Text preset="paragraph" className="text-gray-600">
              {option.label}
            </Text>
            <Badge
              color={statusToColor(option.status)}
              label={
                option.status === 'enabled'
                  ? t('vps_dashboard_options_enabled')
                  : t('vps_dashboard_options_disabled')
              }
            />
          </div>
        ))}
      </div>
    </Card>
  );
};
