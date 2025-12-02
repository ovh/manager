import React, { useEffect, useState } from 'react';

import { ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { OdsBadge, OdsLink } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { DataGridTextCell, DatagridColumn } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { TProjectWithService } from '@/data/models/Project.type';
import { PROJECTS_TRACKING } from '@/tracking.constant';

import Actions from './Actions.component';
import StatusComponent from './Status.component';

const useProjectUrl = (
  getProjectUrl: (projectId: string) => Promise<string>,
  projectId: string,
) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    void getProjectUrl(projectId).then(setUrl);
  }, [getProjectUrl, projectId]);

  return url;
};

const ProjectLink: React.FC<{
  projectId: string;
  label: string;
  getProjectUrl: (projectId: string) => Promise<string>;
  isRedirectExternal: boolean;
  isSuspended: boolean;
}> = ({ projectId, label, getProjectUrl, isRedirectExternal, isSuspended }) => {
  const url = useProjectUrl(getProjectUrl, projectId);
  const { trackClick } = useOvhTracking();

  const handleTracking = () => {
    trackClick({
      actionType: 'action',
      actions: PROJECTS_TRACKING.LISTING.SHOW_PROJECT,
    });
  };

  if (isSuspended) {
    return (
      <OdsLink
        href="#"
        label={label}
        className="pointer-events-none cursor-not-allowed opacity-50"
      />
    );
  }

  return isRedirectExternal ? (
    <OdsLink href={url || '#'} onClick={handleTracking} label={label} target="_top" />
  ) : (
    <OdsLink href={url || '#'} onClick={handleTracking} label={label} />
  );
};

export const getDatagridColumns = (
  t: (key: string, options?: { ns?: string }) => string,
  getProjectUrl: (projectId: string) => Promise<string>,
  isRedirectExternal: boolean,
): DatagridColumn<TProjectWithService>[] => [
  {
    id: 'description',
    label: t('description', { ns: NAMESPACES.DASHBOARD }),
    cell: (props: TProjectWithService) => (
      <DataGridTextCell>
        <ProjectLink
          projectId={props.project_id}
          label={props.description || ''}
          getProjectUrl={getProjectUrl}
          isRedirectExternal={isRedirectExternal}
          isSuspended={props.status === 'suspended'}
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
    label: t('status', { ns: NAMESPACES.STATUS }),
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
    cell: (props: TProjectWithService) => <Actions projectWithService={props} />,
    label: '',
    isSortable: false,
    isSearchable: false,
  },
];
