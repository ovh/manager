import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { THost } from '@/domain/types/host';
import DatagridColumnStatus from '@/domain/components/DatagridColumns/DatagridColumnStatus';
import { StatusEnum } from '@/domain/enum/Status.enum';
import { DrawerActionEnum } from '@/domain/enum/hostConfiguration.enum';

interface UseHostsDatagridColumnsProps {
  readonly setDrawer: Dispatch<
    SetStateAction<{ isOpen: boolean; action?: DrawerActionEnum }>
  >;
  readonly setHostData: Dispatch<SetStateAction<THost>>;
}

export const useHostsDatagridColumns = ({
  setDrawer,
  setHostData,
}: UseHostsDatagridColumnsProps) => {
  const { t } = useTranslation([
    'domain',
    NAMESPACES.ACTIONS,
    NAMESPACES.STATUS,
  ]);

  const columns = [
    {
      id: 'host',
      label: t('domain_tab_hosts_listing_table_host'),
      cell: (props: THost) => <DataGridTextCell>{props.host}</DataGridTextCell>,
    },
    {
      id: 'target',
      label: t('domain_tab_hosts_listing_table_target'),
      cell: (props: THost) => (
        <DataGridTextCell>
          {JSON.stringify(props.ips).replace(/,/g, ', ')}
        </DataGridTextCell>
      ),
    },

    {
      id: 'status',
      label: t(`${NAMESPACES.STATUS}:status`),
      cell: (props: THost) => <DatagridColumnStatus status={props.status} />,
    },

    {
      id: 'actions',
      label: '',
      cell: (props: THost) => (
        <ActionMenu
          items={[
            {
              id: 1,
              label: t(`${NAMESPACES.ACTIONS}:modify`),
              onClick: () => {
                setDrawer({ isOpen: true, action: DrawerActionEnum.Modify });
                setHostData(props);
              },
            },
            {
              id: 2,
              label: t(`${NAMESPACES.ACTIONS}:delete`),
              color: ODS_BUTTON_COLOR.critical,
              isDisabled: props.status === StatusEnum.DELETING,
            },
          ]}
          id={props.host}
          isCompact
          variant={ODS_BUTTON_VARIANT.ghost}
        />
      ),
    },
  ];

  return columns;
};
