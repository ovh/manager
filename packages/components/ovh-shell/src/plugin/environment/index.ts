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
    setUniverse: (applicationId: ApplicationId) => {
      const universe = environment.setUniverseFromApplicationId(applicationId);
      triggerListeners(universe);
    },
    onUniverseChange: (callback: CallableFunction) => {
      listeners.push(callback);
    },
  };
}

export default environment;
