import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import DatagridActions from '@/components/datagrid-actions/DatagridActions.component';
import { TGroupedNetwork } from '@/types/network.type';

export function usePrivateNetworkColumns() {
  const { t } = useTranslation(['listing', 'common']);

  return useMemo(
    () => [
      {
        id: 'name',
        cell: ({ name }: TGroupedNetwork) => (
          <DataGridTextCell>{name}</DataGridTextCell>
        ),
        label: t('pci_projects_project_network_private_name'),
      },
      {
        id: 'region',
        cell: ({ regions }: TGroupedNetwork) => (
          <DataGridTextCell>{regions}</DataGridTextCell>
        ),
        label: t('pci_projects_project_network_private_region'),
      },
      {
        id: 'vlanId',
        cell: ({ vlanId }: TGroupedNetwork) => (
          <DataGridTextCell>{vlanId}</DataGridTextCell>
        ),
        label: t('pci_projects_project_network_private_vlan_id'),
      },
      {
        id: 'actions',
        cell: () => (
          <DataGridTextCell>
            <DatagridActions
              actions={[
                {
                  id: 1,
                  content: (
                    <OsdsButton
                      size={ODS_BUTTON_SIZE.sm}
                      variant={ODS_BUTTON_VARIANT.ghost}
                      color={ODS_THEME_COLOR_INTENT.primary}
                      disabled
                    >
                      <OsdsText
                        size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                        level={ODS_TEXT_LEVEL.button}
                        color={ODS_TEXT_COLOR_INTENT.primary}
                        slot="start"
                      >
                        {t(
                          'pci_projects_project_network_private_subnet_create',
                        )}
                      </OsdsText>
                    </OsdsButton>
                  ),
                },
                {
                  id: 2,
                  content: (
                    <OsdsButton
                      size={ODS_BUTTON_SIZE.sm}
                      variant={ODS_BUTTON_VARIANT.ghost}
                      color={ODS_THEME_COLOR_INTENT.primary}
                      disabled
                    >
                      <OsdsText
                        size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                        level={ODS_TEXT_LEVEL.button}
                        color={ODS_TEXT_COLOR_INTENT.primary}
                        slot="start"
                      >
                        {t('pci_projects_project_network_private_subnet_show')}
                      </OsdsText>
                    </OsdsButton>
                  ),
                },
                {
                  id: 3,
                  content: (
                    <OsdsButton
                      size={ODS_BUTTON_SIZE.sm}
                      variant={ODS_BUTTON_VARIANT.ghost}
                      color={ODS_THEME_COLOR_INTENT.primary}
                      disabled
                    >
                      <OsdsText
                        size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                        level={ODS_TEXT_LEVEL.button}
                        color={ODS_TEXT_COLOR_INTENT.primary}
                        slot="start"
                      >
                        {t('pci_projects_project_network_private_delete')}
                      </OsdsText>
                    </OsdsButton>
                  ),
                },
              ]}
            />
          </DataGridTextCell>
        ),
        label: t('pci_projects_project_network_private_action'),
      },
    ],
    [],
  );
}
