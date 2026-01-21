import { useProject } from '@ovh-ux/manager-pci-common';
import {
  ButtonType,
  PageLocation,
  useNavigation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

type TProjectActivation = {
  activateDiscoveryProject: () => void;
};

export const useProjectActivation = (): TProjectActivation => {
  const { data: project } = useProject();
  const { navigateTo } = useNavigation();
  const { trackClick } = useOvhTracking();

  const activateDiscoveryProject = () => {
    void navigateTo(
      'public-cloud',
      `#/pci/projects/${project?.project_id}/activate`,
      {},
    );

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['add_instance', 'activate_project'],
    });
  };

  return { activateDiscoveryProject };
};
