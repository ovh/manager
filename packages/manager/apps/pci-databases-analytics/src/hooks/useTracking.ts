import { useContext, useEffect } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import usePciProject from './api/project/usePciProject.hook';
import { PCI_LEVEL2 } from '@/configuration/tracking.constants';
import { PlanCode } from '@/types/cloud/Project';

// Set the project mode, needed to track discovery actions
function useProjectModeTracking() {
  const { shell } = useContext(ShellContext);
  const { setPciProjectMode } = shell.tracking;
  const { data: project } = usePciProject();
  useEffect(() => {
    if (project) {
      setPciProjectMode({
        projectId: project.project_id,
        isDiscoveryProject: project.planCode === PlanCode.DISCOVERY,
      });
    }
  }, [project]);
}

// Provide a function to track actions with the correct
// type and level
export function useTrackAction() {
  useProjectModeTracking();
  const { shell } = useContext(ShellContext);
  const { trackClick } = shell.tracking;

  return (trackingName: string) => {
    trackClick({
      type: 'action',
      name: trackingName,
      level2: PCI_LEVEL2,
    });
  };
}

// Fire a page tracking event when landing on the page
export function useTrackPage(pageTracking: string) {
  useProjectModeTracking();
  const { shell } = useContext(ShellContext);
  const { trackPage } = shell.tracking;
  useEffect(() => {
    trackPage({
      name: pageTracking,
      level2: PCI_LEVEL2,
    });
  }, []);
}
