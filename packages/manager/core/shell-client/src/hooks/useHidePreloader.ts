import { useContext, useEffect } from 'react';
import { ShellContext } from '../ShellContext';

export const useHidePreloader = () => {
  const { ux } = useContext(ShellContext).shell;

  useEffect(() => {
    ux.hidePreloader();
  }, [ux]);
};
