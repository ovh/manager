import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { getLocations } from '@/data/api/locations/locations.requests';
import { queryKeys } from '@/data/queries/queryKeys';
import { Location } from '@/types/Location.type';
import { toApiLanguage } from '@/utils/locale/apiLanguage';

/** Localisations OVHcloud disponibles, libellés traduits dans la locale courante. */
export const useLocations = (): UseQueryResult<Location[]> => {
  const { i18n } = useTranslation();
  const language = toApiLanguage(i18n.language);

  return useQuery({
    queryKey: queryKeys.locations.list(language ?? 'default'),
    queryFn: () => getLocations(language),
    // Référentiel géographique : pas de raison de le rafraîchir pendant la session.
    staleTime: Infinity,
  });
};
