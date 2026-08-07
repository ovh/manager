import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { LOCATION_DEFINITIONS } from '@/data/locations.data';
import { Location } from '@/types/Location.type';

/**
 * Localisations disponibles pour un vault : catalogue en dur (cf. `locations.data.ts`), les
 * libellés (ville/pays/zone géographique) sont résolus dans la locale courante depuis les
 * référentiels partagés `region`/`country` de `@ovh-ux/manager-common-translations`.
 */
export const useLocations = (): Location[] => {
  const { t, i18n } = useTranslation([NAMESPACES.REGION, NAMESPACES.COUNTRY]);

  return useMemo(
    () =>
      LOCATION_DEFINITIONS.map((definition) => ({
        ...definition,
        cityName: t(`region_${definition.code}`, { ns: NAMESPACES.REGION }),
        geographyName: t(`region_continent_${definition.code}`, {
          ns: NAMESPACES.REGION,
        }),
        countryName: t(`country_${definition.countryCode}`, {
          ns: NAMESPACES.COUNTRY,
        }),
      })),

    [t, i18n.language],
  );
};
