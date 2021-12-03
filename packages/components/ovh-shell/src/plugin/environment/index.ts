import { Environment } from '@ovh-ux/manager-config';
import { ApplicationId } from '@ovh-ux/manager-config/types/application';

export function environment(environment: Environment) {
  return {
    getEnvironment: (): Environment => environment,
    setUniverse: (applicationId: ApplicationId) =>
      environment.setUniverseFromApplicationId(applicationId),
  };
}

export default environment;
