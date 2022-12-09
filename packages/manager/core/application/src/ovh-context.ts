import React from 'react';
import { useShellClient } from '@ovh-ux/shell';
import { ApplicationId, Environment } from '@ovh-ux/manager-config';

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
export type OvhContextShellType = Awaited<ReturnType<typeof useShellClient>>;
export type OvhContextType = {
  shell: OvhContextShellType;
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
