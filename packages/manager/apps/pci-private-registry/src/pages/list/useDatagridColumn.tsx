import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { TRegistry } from '@/api/data/registry';
import ActionComponent from '@/components/listing/Action.component';
import { RegistryPlan } from '@/components/listing/RegistryPlan.component';
import { RegistrySpace } from '@/components/listing/RegistrySpace.component';
import RegistryStatus from '@/components/listing/RegistryStatus.component';

export const useDatagridColumn = () => {
  const { t } = useTranslation();

  const columns: DatagridColumn<TRegistry>[] = [
    {
      id: 'name',
      label: t('private_registry_name'),
      cell: (props) => <DataGridTextCell>{props.name}</DataGridTextCell>,
    },
    {
      id: 'id',
      label: t('private_registry_id'),
      cell: (props) => <DataGridTextCell>{props.id}</DataGridTextCell>,
    },
    {
      id: 'region',
      label: t('private_registry_region'),
      cell: (props) => <DataGridTextCell>{props.region}</DataGridTextCell>,
    },
    {
      id: 'planSize',
      label: t('private_registry_plan'),
      cell: (props) => <RegistryPlan registry={props} />,
      isSortable: false,
    },
    {
      id: 'version',
      label: t('private_registry_harbor_version'),
      cell: (props) => <DataGridTextCell>{props.version}</DataGridTextCell>,
    },
    {
      id: 'status',
      label: t('private_registry_status'),
      cell: (props) => <RegistryStatus status={props.status} />,
    },
    {
      id: 'consumption',
      label: t('private_registry_consumption'),
      cell: (props) => <RegistrySpace registry={props} />,
      isSortable: false,
    },
    {
      id: 'actions',
      label: '',
      cell: (props) => <ActionComponent registry={props} />,
    },
  ];

  return columns;
};
