import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect } from 'react';

export default function HidePreloader() {
  const { ux } = useContext(ShellContext).shell;

  useEffect(() => {
    ux.hidePreloader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
