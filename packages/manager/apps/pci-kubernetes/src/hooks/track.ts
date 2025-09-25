import { useContext } from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { TRACKING_PREFIX } from '@/constants';

export const useTrack = () => {
  const { tracking } = useContext(ShellContext).shell;
  return {
    trackClick: (name: string) =>
      tracking.trackClick({
        name: `${TRACKING_PREFIX}::${name}`,
        type: 'action',
      }),
  };
};
