import { Application } from '@ovh-ux/manager-config';

import { useEnvironment as useEnv } from '..';

export function useEnvironment() {
  const env = useEnv();

  return {
    get application(): Readonly<Application> | undefined {
      return env?.getApplication();
    },
    get region(): string | undefined {
      return env?.getRegion();
    },
    get universe(): string | undefined {
      return env?.getUniverse();
    },
    get locale(): string | undefined {
      return env?.getUserLocale();
    },
    get container() {
      return {
        ...(env?.getApplication()?.container || {}),
      };
    },
  };
}

export default useEnvironment;
