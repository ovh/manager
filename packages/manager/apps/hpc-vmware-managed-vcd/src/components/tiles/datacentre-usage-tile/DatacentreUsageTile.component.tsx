import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu, DashboardTile } from '@ovh-ux/manager-react-components';
import { VCDDatacentre } from '@ovh-ux/manager-module-vcd-api';
import { OdsText } from '@ovhcloud/ods-components/react';

type TTileProps = {
  vcdDatacentre: VCDDatacentre;
};

export default function DatacentreUsageTile({
  vcdDatacentre,
}: Readonly<TTileProps>) {
  const { t } = useTranslation('datacentres');

  return (
    <div>
      <DashboardTile
        title={t('managed_vcd_vdc_usage')}
        items={[
          {
            id: 'vcpuSpeed',
            label: t('managed_vcd_vdc_vcpu_speed'),
            value: (
              <div className="flex items-center justify-between">
                <OdsText>
                  {t('managed_vcd_vdc_vcpu_value', {
                    speed: vcdDatacentre?.currentState.vCPUSpeed,
                  })}
                </OdsText>
                <ActionMenu id="usage_menu" items={[]} isCompact />
              </div>
            ),
          },
          {
            id: 'vcpuCount',
            label: t('managed_vcd_vdc_vcpu_count'),
            value: <OdsText>{vcdDatacentre?.currentState.vCPUCount}</OdsText>,
          },
        ]}
      />
    </div>
  );
}
