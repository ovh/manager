import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ActionMenu,
  Badge,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BUTTON_COLOR } from '@ovhcloud/ods-react';
import { DrawerActionEnum } from '@/domain/enum/hostConfiguration.enum';
import { THost } from '@/domain/types/hostResource';

interface UseHostsDatagridColumnsProps {
  readonly setDrawer: Dispatch<
    SetStateAction<{ isOpen: boolean; action?: DrawerActionEnum }>
  >;
  readonly setFormData: Dispatch<
    SetStateAction<{ host?: string; ips?: string[] }>
  >;
}

export const useHostsDatagridColumns = ({
  setDrawer,
  setFormData,
}: UseHostsDatagridColumnsProps) => {
  const { t } = useTranslation([
    'domain',
    NAMESPACES.ACTIONS,
    NAMESPACES.STATUS,
  ]);
  const navigate = useNavigate();

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
      cell: () => (
        <Badge color={BUTTON_COLOR.information} label="En cours d'activation" />
      ),
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
                setFormData(props);
              },
            },
            {
              id: 2,
              label: t(`${NAMESPACES.ACTIONS}:delete`),
              color: ODS_BUTTON_COLOR.critical,
              onClick: () => navigate(`${props.host}/delete`),
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
