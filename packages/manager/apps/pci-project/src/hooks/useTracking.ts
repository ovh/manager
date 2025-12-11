import { useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { useProject } from '@ovh-ux/manager-pci-common';

import { DISCOVERY_PROJECT_PLANCODE } from '@/constants';
import { usePciProjectsCount } from '@/data/hooks/useProjects';

export const useTrackingAdditionalData = () => {
  const { projectId } = useParams();
  const { data: project } = useProject(projectId, { retry: false });
  const { data: projectsCount } = usePciProjectsCount();

  return useMemo(
    () => ({
      projectId: projectId || '',
      pciCreationNumProjects: projectsCount != null ? String(projectsCount) : '',
      pciProjectMode: project
        ? project.planCode === DISCOVERY_PROJECT_PLANCODE
          ? 'discovery'
          : 'full'
        : '',
    }),
    [projectId, project, projectsCount],
  );
};
