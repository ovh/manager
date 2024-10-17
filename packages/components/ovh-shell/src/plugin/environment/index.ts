import { Environment, ApplicationId, User } from '@ovh-ux/manager-config';

export function environment(environment: Environment) {
  const listeners: CallableFunction[] = [];
  const userListeners: CallableFunction[] = [];

  const triggerListeners = (...params: any[]) => {
    listeners.forEach((listener) => {
      listener.bind(null)(...params);
    });
  };

  const triggerUserListeners = (user: User) => {
    userListeners.forEach((listener) => {
      listener(user);
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
    onUserChange: (callback: CallableFunction) => {
      userListeners.push(callback);
    },
    setUser: (user: User) => {
      const updatedUser = { ...environment.user, ...user };
      environment.setUser(updatedUser);
      triggerUserListeners(updatedUser);
    },
  };
}

export default environment;
