import { useContext, useEffect } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { PciProjectPlanCode } from '@/models/project';
import usePciProject from './api/pciProjects.api.hooks';
import { PCI_LEVEL2 } from '@/configuration/tracking';

// Set the project mode, needed to track discovery actions
function useProjectModeTracking() {
  const { shell } = useContext(ShellContext);
  const { setPciProjectMode } = shell.tracking;
  const { data: project } = usePciProject();
  useEffect(() => {
    if (project) {
      setPciProjectMode({
        projectId: project.project_id,
        isDiscoveryProject: project.planCode === PciProjectPlanCode.DISCOVERY,
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
    console.log('action', trackingName);
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
    console.log('page', pageTracking);
    trackPage({
      name: pageTracking,
      level2: PCI_LEVEL2,
    });
  }, []);
}
