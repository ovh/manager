import { useContext, useEffect } from 'react';

import { useProject } from '@ovh-ux/manager-pci-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { DISCOVERY_PROJECT_PLANCODE } from '@/constants';

export const useProjectModeTracking = () => {
  const { shell } = useContext(ShellContext);
  const { data: project } = useProject();

  useEffect(() => {
    if (project) {
      shell.tracking.setPciProjectMode({
        projectId: project.project_id,
        isDiscoveryProject: project.planCode === DISCOVERY_PROJECT_PLANCODE,
      });
    }
  }, [project]);
};
