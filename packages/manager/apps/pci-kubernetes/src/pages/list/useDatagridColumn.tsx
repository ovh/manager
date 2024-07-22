import { DatagridColumn, DataGridTextCell } from '@ovhcloud/manager-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsClipboard, OsdsLink } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import ActionsComponent from '@/components/listing/actions.component';
import { TKube } from '@/types';

export const useDatagridColumn = () => {
  const { t } = useTranslation('listing');

  const columns: DatagridColumn<TKube>[] = [
    {
      id: 'name',
      cell: (props: TKube) => (
        <DataGridTextCell>
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.primary}
            href={useHref(`${props.id}`)}
          >
            {props.name}
          </OsdsLink>
        </DataGridTextCell>
      ),
      label: t('kube_list_name'),
    },
    {
      id: 'id',
      cell: (props: TKube) => (
        <DataGridTextCell>
          <OsdsClipboard
            aria-label="clipboard"
            value={props.id}
          ></OsdsClipboard>
        </DataGridTextCell>
      ),
      label: t('kube_list_id'),
    },
    {
      id: 'region',
      cell: (props: TKube) => (
        <DataGridTextCell>{props.region}</DataGridTextCell>
      ),
      label: t('kube_list_region'),
    },
    {
      id: 'attachedTo',
      cell: (props: TKube) => (
        <DataGridTextCell>{props.attachedTo}</DataGridTextCell>
      ),
      label: t('kube_list_network_attached'),
    },
    {
      id: 'version',
      cell: (props: TKube) => (
        <DataGridTextCell>{props.version}</DataGridTextCell>
      ),
      label: t('kube_list_version'),
    },
    {
      id: 'actions',
      cell: (props: TKube) => (
        <div className="min-w-16">
          <ActionsComponent kubeId={props.id} />
        </div>
      ),
      label: '',
    },
  ];

  return columns;
};
