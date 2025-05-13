import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect } from 'react';

export default function HidePreloader(): null {
  const { ux } = useContext(ShellContext).shell;

  useEffect(() => {
    ux.hidePreloader();
  }, []);

  return null;
}
