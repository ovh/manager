import React, { useContext, useEffect, useState } from 'react';
import { initShell, Shell } from '@ovh-ux/shell';

import ApplicationContext from './application.context';
import { HeaderProvider } from './header';
import { setupDevApplication } from '@/core/dev';

type Props = {
  children: JSX.Element;
};

export const ApplicationProvider = ({
  children = null,
}: Props): JSX.Element => {
  const [shell, setShell] = useState<Shell | null>(null);

  useEffect(() => {
    initShell().then(setShell);
  }, []);

  let applicationContext = useContext(ApplicationContext);

  if (!shell) {
    return null;
  }

  setupDevApplication(shell);

  applicationContext = {
    environment: shell.getPlugin('environment').getEnvironment(),
    shell,
  };

  return (
    <ApplicationContext.Provider
      value={applicationContext}
    >
      <HeaderProvider>{children}</HeaderProvider>
    </ApplicationContext.Provider>
  );
};

export default ApplicationProvider;
