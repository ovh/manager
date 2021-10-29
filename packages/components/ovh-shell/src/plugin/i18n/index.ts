import { Environment } from '@ovh-ux/manager-config';
import Shell from '../../shell/shell';

export function i18n(shell: Shell, environment: Environment) {
  return {
    getLocale: (): string => environment.getUserLocale(),
    setLocale: (locale: string): void =>
      shell.emitEvent('i18n:locale-change', { locale }),
  };
}

export default i18n;
