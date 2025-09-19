import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Currency } from '@ovh-ux/manager-config';
import { getSettings } from '../../api/settings';
import { BillingCountry, SupportLanguage } from '@/types/settings';
import { getRegion } from '@/helpers/region/regionHelper';

export const useCountrySettings = () => {
  const { t } = useTranslation(NAMESPACES.COUNTRY);
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings(getRegion()),
    select: (settings: Map<string, BillingCountry[]>) =>
      Array.from(settings.keys())
        .map((countryCode) => ({
          code: countryCode,
          label: t(`country_${countryCode}`),
        }))
        .sort((countryA, countryB) =>
          countryA.label > countryB.label ? 1 : -1,
        ),
  });
};

export const useCurrencySettings = (country?: string) =>
  useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings(getRegion()),
    select: (settings: Map<string, BillingCountry[]>) => {
      if (!country) {
        return [];
      }
      return (
        settings
          .get(country)
          ?.reduce((currencies: Currency[], billingCountry) => {
            if (
              !currencies.find(
                (currency) => currency.code === billingCountry.currency.code,
              )
            ) {
              currencies.push(billingCountry.currency);
            }
            return currencies;
          }, []) ?? []
      );
    },
  });

export const useLanguageSettings = (country?: string, currency?: string) =>
  useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings(getRegion()),
    select: (settings: Map<string, BillingCountry[]>) => {
      if (!(country && currency)) {
        return [];
      }
      return (
        settings
          .get(country)
          ?.reduce((languages: SupportLanguage[], billingCountry) => {
            if (
              currency === billingCountry.currency.code &&
              !languages.includes(billingCountry.ietfLanguageTag)
            ) {
              languages.push(billingCountry.ietfLanguageTag);
            }
            return languages;
          }, []) ?? []
      );
    },
  });
