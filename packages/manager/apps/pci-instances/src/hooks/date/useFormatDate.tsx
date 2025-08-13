import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export const useFormatDate = (options?: Intl.DateTimeFormatOptions) => {
  const { i18n } = useTranslation();

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(i18n.language.replace('_', '-'), options),
    [i18n.language, options],
  );

  return {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    formatDate: dateFormatter.format,
  };
};
