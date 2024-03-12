import { initShellClient, ShellClientApi } from '@ovh-ux/shell';
import { ReactNode } from 'react';
import { Environment } from '@ovh-ux/manager-config';
import { ShellContext } from './ShellContext';

export const initShellContext = async (appName: string) => {
  const shell = await initShellClient(appName);
  const environment = await shell.environment.getEnvironment();
  return { shell, environment };
};

export const ShellProvider = ({
  client,
  children,
}: {
  client: {
    shell: ShellClientApi;
    environment: Environment;
  };
  children: ReactNode;
}) => {
  return (
    <>
      {client && (
        <ShellContext.Provider value={client}>{children}</ShellContext.Provider>
      )}
    </>
  );
};

export default initShellContext;
