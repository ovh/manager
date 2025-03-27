import { useContext, useEffect } from 'react';
import { ShellContext } from '../ShellContext';

export const useHidePreloader = () => {
  const { shell } = useContext(ShellContext);

  useEffect(() => {
    shell?.ux.hidePreloader();
  }, [shell?.ux]);
};
