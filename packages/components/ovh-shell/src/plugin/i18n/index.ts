import { Environment } from '@ovh-ux/manager-config';

export function i18n(environment: Environment) {
  return {
    getLocale: (): string => environment.getUserLocale(),
  };
}

export default i18n;
