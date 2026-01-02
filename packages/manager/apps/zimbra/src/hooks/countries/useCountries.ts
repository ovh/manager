import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const useCountries = () => {
  const { t, i18n } = useTranslation(NAMESPACES.COUNTRIES);

  const countriesObj: Record<string, string> = i18n.getResourceBundle(
    i18n.language,
    NAMESPACES.COUNTRIES,
  );
  const countryKeys = Object?.keys(countriesObj ?? {})?.sort((a, b) => {
    const labelA = t(`${NAMESPACES.COUNTRIES}:${a}`);
    const labelB = t(`${NAMESPACES.COUNTRIES}:${b}`);
    return labelA.localeCompare(labelB, i18n.language.slice(0, 2));
  });
  return { countryKeys };
};
