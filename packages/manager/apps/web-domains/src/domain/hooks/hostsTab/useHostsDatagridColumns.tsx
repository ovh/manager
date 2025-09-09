import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DrawerActionEnum } from '@/domain/enum/hostConfiguration.enum';

interface UseHostsDatagridColumnsProps {
  readonly setDrawer: Dispatch<
    SetStateAction<{ isOpen: boolean; action?: DrawerActionEnum }>
  >;
}

export const useHostsDatagridColumns = ({
  setDrawer,
}: UseHostsDatagridColumnsProps) => {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();

  const actions = [
    {
      id: 1,
      label: t(`${NAMESPACES.ACTIONS}:modify`),
      onClick: () => {
        setDrawer({ isOpen: true, action: DrawerActionEnum.Modify });
      },
    },
    {
      id: 2,
      label: t(`${NAMESPACES.ACTIONS}:delete`),
      color: ODS_BUTTON_COLOR.critical,
      onClick: () => navigate('delete'),
    },
  ];

  const columns = [
    {
      id: 'host',
      label: t('domain_tab_hosts_listing_table_host'),
      cell: () => <DataGridTextCell>dns2.mondomain.com</DataGridTextCell>,
    },
    {
      id: 'target',
      label: t('domain_tab_hosts_listing_table_target'),
      cell: () => <DataGridTextCell>["213.186.33.3"]</DataGridTextCell>,
    },
    {
      id: 'actions',
      label: '',
      cell: () => (
        <ActionMenu
          items={actions}
          id={'1'}
          isCompact
          variant={ODS_BUTTON_VARIANT.ghost}
        />
      ),
    },
  ];
  return columns;
};
