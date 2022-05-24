import { Environment } from '@ovh-ux/manager-config';
import { ApplicationId } from '@ovh-ux/manager-config/types/application';

export function environment(environment: Environment) {
  const listeners: CallableFunction[] = [];

  const triggerListeners = (...params: any[]) => {
    listeners.forEach((listener) => {
      listener.bind(null)(...params);
    });
  };

  return {
    getEnvironment: (): Environment => environment,
    setUniverse: (universe: string) => {
      environment.setUniverse(universe);
      triggerListeners(environment.getUniverse());
    },
    setApplication: (applicationId: ApplicationId) => {
      environment.setApplicationName(applicationId);
      environment.setUniverseFromApplicationId(applicationId);
      triggerListeners(environment.getUniverse());
    },
    onUniverseChange: (callback: CallableFunction) => {
      listeners.push(callback);
    },
  };
}

export default environment;
