import { useTranslation } from 'react-i18next';
import { Text, Card } from '@ovhcloud/ods-react';
import { VpsStateBadge } from '@/components/VpsStateBadge/VpsStateBadge.component';
import type { TVpsInfoForView } from '../view-models/dashboard.view-model';

type TVpsInfoTileProps = {
  info: TVpsInfoForView;
};

export const VpsInfoTile = ({ info }: TVpsInfoTileProps) => {
  const { t } = useTranslation('vps');

  const rows = [
    { label: t('vps_dashboard_info_model'), value: info.model },
    { label: t('vps_dashboard_info_vcores'), value: info.vCores.toString() },
    { label: t('vps_dashboard_info_ram'), value: info.ram },
    { label: t('vps_dashboard_info_disk'), value: info.disk },
    { label: t('vps_dashboard_info_datacenter'), value: info.datacenter },
    { label: t('vps_dashboard_info_distribution'), value: info.distribution },
  ];

  return (
    <Card className="p-6">
      <Text preset="heading-4" className="mb-4">
        {t('vps_dashboard_info_tile_title')}
      </Text>

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between">
            <Text preset="paragraph" className="text-gray-600">
              {row.label}
            </Text>
            <Text preset="paragraph" className="font-medium">
              {row.value}
            </Text>
          </div>
        ))}

        <div className="flex justify-between">
          <Text preset="paragraph" className="text-gray-600">
            {t('vps_dashboard_info_state')}
          </Text>
          <VpsStateBadge state={info.state} />
        </div>
      </div>
    </Card>
  );
};
