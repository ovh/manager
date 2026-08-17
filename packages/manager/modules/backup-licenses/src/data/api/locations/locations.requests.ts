import { getJSON } from '@/data/api/Client.api';
import { Location } from '@/types/Location.type';
import { LOCATIONS_ROUTE } from '@/utils/apiRoutes/apiRoutes';

/**
 * `/location` est paginé par curseur. Le référentiel complet compte quelques
 * dizaines d'entrées : une page suffit, on évite ainsi la boucle de pagination.
 */
const LOCATIONS_PAGE_SIZE = '500';

/** @param language locale au format `fr_FR` — traduit ville, pays et zone géographique. */
export const getLocations = (language?: string): Promise<Location[]> =>
  getJSON<Location[]>('v2', LOCATIONS_ROUTE, {
    params: language ? { language } : undefined,
    headers: { 'X-Pagination-Size': LOCATIONS_PAGE_SIZE },
  });
