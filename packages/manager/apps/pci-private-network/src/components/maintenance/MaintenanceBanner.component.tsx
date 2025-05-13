import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsLink,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

interface MaintenanceProps {
  maintenanceURL: string;
}

export function MaintenanceBanner({
  maintenanceURL,
}: Readonly<MaintenanceProps>) {
  const { t } = useTranslation('maintenance');

  return (
    <OsdsMessage type={ODS_MESSAGE_TYPE.warning}>
      <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
        {t('pci_projects_maintenance_banner_info_list_page', {
          productName: t('pci_projects_project_network_private'),
        })}
      </OsdsText>
      <p>
        <OsdsLink
          color={ODS_THEME_COLOR_INTENT.primary}
          href={maintenanceURL}
          target={OdsHTMLAnchorElementTarget._blank}
          data-testid="maintenanceBanner_link"
        >
          {t('pci_projects_maintenance_banner_info_link')}
        </OsdsLink>
      </p>
    </OsdsMessage>
  );
}
