import { useContext, useEffect } from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export default function HidePreloader() {
  const { ux } = useContext(ShellContext).shell;

  useEffect(() => {
    ux.hidePreloader();
  }, []);

  return null;
}
