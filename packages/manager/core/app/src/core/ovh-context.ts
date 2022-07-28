import React from 'react';
import { useShellClient } from '@ovh-ux/shell';
import { ApplicationId } from '@ovh-ux/manager-config/types/application';
import Environment from '@ovh-ux/manager-config/types/environment';

export type OvhContextType = {
  shell: unknown;
  environment: Environment;
};

export const OvhContext = React.createContext<OvhContextType>({
  shell: null,
  environment: null,
});

export async function initOvhContext(
  appName: ApplicationId,
): Promise<OvhContextType> {
  const shell = await useShellClient(appName);
  const environment = await shell.environment.getEnvironment();
  return { shell, environment };
}

export default OvhContext;
