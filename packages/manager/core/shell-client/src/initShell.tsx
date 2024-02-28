import { initShellClient } from '@ovh-ux/shell';

export const initShellContext = async (appName: string) => {
  const shell = await initShellClient(appName);
  const environment = await shell.environment.getEnvironment();
  return { shell, environment };
};

export default initShellContext;
