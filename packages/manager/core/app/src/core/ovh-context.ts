import React from 'react';
import { useShellClient } from '@ovh-ux/shell';
import { ApplicationId } from '@ovh-ux/manager-config/types/application';
import Environment from '@ovh-ux/manager-config/types/environment';

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
export type OvhContextType = {
  shell: Awaited<ReturnType<typeof useShellClient>>;
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
