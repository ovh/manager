import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import { OsdsAccordion, OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import IpAllocation from './allocationPool/AllocationPool.component';
import HostRoute from './hostRoute/HostRoute.component';
import DNSServer from './dnsServer/DNSServer.component';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';

const AdvancedSettings: FC = () => {
  const { t } = useTranslation('new');
  const { watch } = useFormContext<NewPrivateNetworkForm>();
  const isLocalZone = watch('isLocalZone');

  return (
    <OsdsAccordion color={ODS_THEME_COLOR_INTENT.default}>
      <OsdsText
        level={ODS_TEXT_LEVEL.subheading}
        color={ODS_TEXT_COLOR_INTENT.primary}
        hue={ODS_TEXT_COLOR_HUE._800}
        slot="summary"
      >
        {t('pci_projects_project_network_private_advanced_settings')}
      </OsdsText>
      <div className="flex flex-col gap-5">
        <IpAllocation />
        {!isLocalZone && <DNSServer />}
        <HostRoute />
      </div>
    </OsdsAccordion>
  );
};

export default AdvancedSettings;
