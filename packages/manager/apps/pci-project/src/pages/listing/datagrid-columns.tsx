import {
  DataGridTextCell,
  DatagridColumn,
} from '@ovh-ux/manager-react-components';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { TProjectWithService } from '@/data/project.type';
import StatusComponent from './Status.component';
import Actions from './Actions.component';

export const getDatagridColumns = (
  t: (key: string) => string,
): DatagridColumn<TProjectWithService>[] => [
  {
    id: 'description',
    label: t('pci_projects_description'),
    cell: (props: TProjectWithService) => (
      <DataGridTextCell>{props.description}</DataGridTextCell>
    ),
    isSearchable: true,
    isSortable: true,
    isFilterable: true,
    type: FilterTypeCategories.String,
  },
  {
    id: 'aggregatedStatus',
    label: t('pci_projects_status'),
    cell: (props: TProjectWithService) => (
      <DataGridTextCell>
        <StatusComponent project={props} />
      </DataGridTextCell>
    ),
    isSearchable: false,
    isSortable: true,
    isFilterable: true,
    type: FilterTypeCategories.String,
  },
  {
    id: 'actions',
    cell: (props: TProjectWithService) => (
      <Actions projectWithService={props} />
    ),
    label: '',
    isSortable: false,
    isSearchable: false,
  },
];
