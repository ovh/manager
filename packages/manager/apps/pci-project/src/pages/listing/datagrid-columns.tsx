import {
  DataGridTextCell,
  DatagridColumn,
} from '@ovh-ux/manager-react-components';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { TProjectWithService } from '@/data/types/project.type';
import StatusComponent from './Status.component';

export const getDatagridColumns = (
  t: (key: string) => string,
): DatagridColumn<TProjectWithService>[] => [
  {
    id: 'description',
    label: t('pci_projects_description'),
    cell: (props: TProjectWithService) => (
      <DataGridTextCell>
        {props.description}
        {props.isDefault && (
          <OdsBadge
            label={t('pci_projects_project_default_project')}
            size={ODS_BADGE_SIZE.sm}
            className="ml-4"
          />
        )}
      </DataGridTextCell>
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
    isFilterable: false,
    type: FilterTypeCategories.String,
  },
  {
    id: 'actions',
    cell: () => <div></div>,
    label: '',
    isSortable: false,
    isSearchable: false,
  },
];
