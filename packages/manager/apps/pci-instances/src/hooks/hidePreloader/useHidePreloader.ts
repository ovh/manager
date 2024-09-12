import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect } from 'react';

export const useHidePreloader = () => {
  const { ux } = useContext(ShellContext).shell;
  useEffect(() => {
    ux.hidePreloader();
  }, [ux]);
};
