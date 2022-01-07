import { Environment } from '@ovh-ux/manager-config';
import { ApplicationId } from '@ovh-ux/manager-config/types/application';

export function environment(environment: Environment) {
  const listeners: CallableFunction[] = [];

  const triggerListeners = (applicationId: string) => {
    listeners.forEach((listener) => {
      listener(applicationId);
    });
  };

  return {
    getEnvironment: (): Environment => environment,
    setUniverse: (applicationId: ApplicationId) => {
      environment.setUniverseFromApplicationId(applicationId);
      triggerListeners(applicationId);
    },
    onUniverseChange: (callback: CallableFunction) => {
      listeners.push(callback);
    },
  };
}

export default environment;
