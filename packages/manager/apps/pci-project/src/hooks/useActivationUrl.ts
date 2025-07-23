import { useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const useActivationUrl = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { shell } = useContext(ShellContext);

  const goToActivation = useCallback(async () => {
    if (!projectId) return;

    await shell.navigation.navigateTo(
      'public-cloud',
      `#/pci/projects/${projectId}/activate`,
      {},
    );
  }, [projectId, shell.navigation]);

  return { goToActivation };
};
