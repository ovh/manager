import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import { OsdsAccordion, OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import IpAllocation from './allocationPool/AllocationPool.component';

const AdvancedSettings: React.FC = () => {
  const { t } = useTranslation('new');

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
      <div className="flex flex-col gap-6">
        <IpAllocation />
      </div>
    </OsdsAccordion>
  );
};

export default AdvancedSettings;
