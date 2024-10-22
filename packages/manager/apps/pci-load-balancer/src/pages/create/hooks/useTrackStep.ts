import { useCallback, useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { LOAD_BALANCER_CREATION_TRACKING } from '@/constants';

export const useTrackStep = () => {
  const { tracking } = useContext(ShellContext).shell;

  const trackStep = useCallback(
    (step: number) => {
      tracking.trackClick({
        name: LOAD_BALANCER_CREATION_TRACKING[`FINISH_STEP_${step}`],
        type: 'action',
      });
    },
    [tracking],
  );

  return { trackStep };
};
