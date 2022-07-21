import React from 'react';
import { useShellClient } from '@ovh-ux/shell';

export const OvhContext = React.createContext({});

export async function initOvhContext(appName: string) {
  const shell = await useShellClient(appName);
  const environment = await shell.environment.getEnvironment();
  return { shell, environment };
}

export default OvhContext;
