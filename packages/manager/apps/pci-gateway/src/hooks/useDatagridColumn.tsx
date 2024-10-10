import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { Gateway } from '@/interface';
import PrivateIPs from '@/components/list/PrivateIPs.component';
import Actions from '@/components/list/Actions.component';

export const useDatagridColumn = (
  projectId: string,
  privateNetworkUrl: string,
) => {
  const { t } = useTranslation('common');
  const columns: DatagridColumn<Gateway>[] = [
    {
      id: 'name',
      cell: (props: Gateway) => (
        <>
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._500}
            color={ODS_THEME_COLOR_INTENT.text}
            className="block"
          >
            {props.name}
          </OsdsText>
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
            className="block"
          >
            {props.id}
          </OsdsText>
        </>
      ),
      label: t('pci_projects_project_public_gateway_name'),
    },
    {
      id: 'region',
      cell: (props: Gateway) => (
        <DataGridTextCell>{props.region}</DataGridTextCell>
      ),
      label: t('pci_projects_project_public_gateway_region'),
    },
    {
      id: 'networksConnected',
      cell: (props: Gateway) => (
        <OsdsLink
          href={privateNetworkUrl}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          {props.connectedNetworkCount}
        </OsdsLink>
      ),
      label: t('pci_projects_project_public_gateway_networks_connected'),
    },
    {
      id: 'formattedIps',
      cell: (props: Gateway) => (
        <DataGridTextCell>{props.formattedIps}</DataGridTextCell>
      ),
      label: t('pci_projects_project_public_gateway_public_ip'),
    },
    {
      id: 'flavour',
      cell: (props: Gateway) => (
        <DataGridTextCell>{props.model}</DataGridTextCell>
      ),
      label: t('pci_projects_project_public_gateway_flavour'),
    },
    {
      id: 'status',
      cell: (props: Gateway) => (
        <DataGridTextCell>{props.status}</DataGridTextCell>
      ),
      label: t('pci_projects_project_public_gateway_status'),
    },
    {
      id: 'privateIPs',
      cell: (props: Gateway) => <PrivateIPs interfaces={props.interfaces} />,
      label: t('pci_projects_project_public_gateway_private_ip'),
    },
    {
      id: 'actions',
      cell: (props: Gateway) => (
        <div className="min-w-16">
          <Actions projectId={projectId} gateway={props} />
        </div>
      ),
      label: '',
    },
  ];
  return columns;
};
