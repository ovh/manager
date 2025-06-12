import React, { useEffect, useState } from 'react';
import {
  DataGridTextCell,
  DatagridColumn,
} from '@ovh-ux/manager-react-components';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { OdsBadge, OdsLink } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { TProjectWithService } from '@/data/types/project.type';
import StatusComponent from './Status.component';
import Actions from './Actions.component';

const useProjectUrl = (
  getProjectUrl: (projectId: string) => Promise<string>,
  projectId: string,
) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    getProjectUrl(projectId).then(setUrl);
  }, [getProjectUrl, projectId]);

  return url;
};

const ProjectLink: React.FC<{
  projectId: string;
  label: string;
  getProjectUrl: (projectId: string) => Promise<string>;
}> = ({ projectId, label, getProjectUrl }) => {
  const url = useProjectUrl(getProjectUrl, projectId);

  return <OdsLink href={url || '#'} label={label} />;
};

export const getDatagridColumns = (
  t: (key: string) => string,
  getProjectUrl: (projectId: string) => Promise<string>,
): DatagridColumn<TProjectWithService>[] => [
  {
    id: 'description',
    label: t('pci_projects_description'),
    cell: (props: TProjectWithService) => (
      <DataGridTextCell>
        <ProjectLink
          projectId={props.project_id}
          label={props.description || ''}
          getProjectUrl={getProjectUrl}
        />
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
    cell: (props: TProjectWithService) => (
      <Actions projectWithService={props} />
    ),
    label: '',
    isSortable: false,
    isSearchable: false,
  },
];
