import { useCallback, useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useProjectIdFromParams } from '@/hooks/useProjectIdFromParams';

export const useActivationUrl = () => {
  const projectId = useProjectIdFromParams();
  const { shell } = useContext(ShellContext);

  const goToActivation = useCallback(async () => {
    await shell.navigation.navigateTo(
      'public-cloud',
      `#/pci/projects/${projectId}/activate`,
      {},
    );
  }, [projectId, shell.navigation]);

  return { goToActivation };
};
