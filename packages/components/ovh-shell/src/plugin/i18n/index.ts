export function i18n(environment: any) {
  return {
    getLocale: (): string => environment.getUserLocale(),
  };
}

export default i18n;
