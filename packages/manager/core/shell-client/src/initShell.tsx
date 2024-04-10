import { initShellClient } from '@ovh-ux/shell';
import { TrackingContextParams } from './ShellContext';

export const initShellContext = async (
  appName: string,
  tracking?: TrackingContextParams,
) => {
  const shell = await initShellClient(appName);
  const environment = await shell.environment.getEnvironment();
  return { shell, environment, tracking };
};

export default initShellContext;
