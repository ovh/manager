import { useTranslation } from 'react-i18next';

export function useNumberFormat() {
  const { i18n } = useTranslation();
  return {
    formatNumber: (
      value: number,
      options?: Intl.NumberFormatOptions,
    ): string => {
      try {
        return new Intl.NumberFormat(
          i18n.language.replace('_', '-'),
          options,
        ).format(value);
      } catch {
        return `${value}`;
      }
    },
  };
}
