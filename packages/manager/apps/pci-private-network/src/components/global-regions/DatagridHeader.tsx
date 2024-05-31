import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_COLOR_HUE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { PRIVATE_NETWORK_LIST } from '@/constants';

export default function DatagridHeader(): JSX.Element {
  const { t } = useTranslation('listing');

  const renderText = (text?: string) => (
    <OsdsText
      size={ODS_THEME_TYPOGRAPHY_SIZE._500}
      hue={ODS_TEXT_COLOR_HUE._600}
      className="text-center h-11 whitespace-nowrap"
    >
      {text}
    </OsdsText>
  );

  return (
    <tr>
      <th className="p-4">
        {renderText(t('pci_projects_project_network_private_vlan_id'))}
      </th>
      <th className="p-4">
        {renderText(t('pci_projects_project_network_private_name'))}
      </th>
      <th className="p-4">
        {renderText(t('pci_projects_project_network_private_region'))}
      </th>
      <th className="p-4">{renderText(PRIVATE_NETWORK_LIST.CIDR)}</th>
      <th className="p-4">
        {renderText(t('pci_projects_project_network_private_gateway'))}
      </th>
      <th className="p-4">{renderText(PRIVATE_NETWORK_LIST.DHCP)}</th>
      <th className="p-4">
        {renderText(t('pci_projects_project_network_private_ip_allocation'))}
      </th>
      <th className="w-[8rem]">{renderText()}</th>
    </tr>
  );
}
