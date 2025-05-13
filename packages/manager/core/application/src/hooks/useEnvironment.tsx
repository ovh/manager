import { Application } from '@ovh-ux/manager-config';

import { useEnvironment as useEnv } from '..';

export function useEnvironment() {
  const env = useEnv();

  return {
    get application(): Readonly<Application> {
      return env.getApplication();
    },
    get region(): string {
      return env.getRegion();
    },
    get universe(): string {
      return env.getUniverse();
    },
    get locale(): string {
      return env.getUserLocale();
    },
    get container() {
      return {
        ...env.getApplication()?.container,
      };
    },
  };
}

export default useEnvironment;
