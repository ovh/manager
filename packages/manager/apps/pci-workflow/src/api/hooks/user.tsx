import { useContext, useMemo } from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const useMe = () => {
  const context = useContext(ShellContext);

  return {
    me: useMemo(() => context.environment.getUser(), [context]),
  };
};
