import { Environment, ApplicationId } from '@ovh-ux/manager-config';

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
      triggerListeners(environment.setUniverseFromApplicationId(applicationId));
    },
    onUniverseChange: (callback: CallableFunction) => {
      listeners.push(callback);
    },
  };
}

export default environment;
