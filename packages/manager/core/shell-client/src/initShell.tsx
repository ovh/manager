/* eslint-disable @typescript-eslint/naming-convention */
import { initShellClient } from '@ovh-ux/shell';
import { defineApplicationVersion } from '@ovh-ux/request-tagger';
import { TrackingContextParams } from './ShellContext';

declare const __VERSION__: string;

export const initShellContext = async (
  appName: string,
  tracking?: TrackingContextParams,
) => {
  const shell = await initShellClient(appName);
  const environment = await shell.environment.getEnvironment();

  if (__VERSION__) {
    defineApplicationVersion(__VERSION__);
  }

  return { shell, environment, tracking };
};

// patch fix

// new feature

// new breacking change

export default initShellContext;
