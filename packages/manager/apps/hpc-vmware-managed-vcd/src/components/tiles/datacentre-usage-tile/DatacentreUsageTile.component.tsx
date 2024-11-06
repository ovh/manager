import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionMenu,
  DashboardTile,
  Description,
} from '@ovh-ux/manager-react-components';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { VCDDatacentre } from '@ovh-ux/manager-module-vcd-api';

type TTileProps = {
  vcdDatacentre: VCDDatacentre;
};

export default function DatacentreUsageTile({
  vcdDatacentre,
}: Readonly<TTileProps>) {
  const { t } = useTranslation('hpc-vmware-managed-vcd/datacentres');

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
                <Description>
                  {t('managed_vcd_vdc_vcpu_value', {
                    speed: vcdDatacentre?.currentState.vCPUSpeed,
                  })}
                </Description>
                <ActionMenu
                  items={[]}
                  icon={ODS_ICON_NAME.ELLIPSIS_VERTICAL}
                  isCompact
                />
              </div>
            ),
          },
          {
            id: 'vcpuCount',
            label: t('managed_vcd_vdc_vcpu_count'),
            value: (
              <Description>{vcdDatacentre?.currentState.vCPUCount}</Description>
            ),
          },
        ]}
      />
    </div>
  );
}
