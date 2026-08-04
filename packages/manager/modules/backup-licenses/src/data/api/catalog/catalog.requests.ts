import { getJSON } from '@/data/api/Client.api';
import { OrderCatalog } from '@/types/Catalog.type';
import { CATALOG_BACKUP_SERVICES_ROUTE } from '@/utils/apiRoutes/apiRoutes';

/**
 * Endpoint confirmé réel (2026-08-03) : contrairement au reste du module, le catalogue
 * Agora public répond déjà en production. Pas de garde `USE_API_MOCKS` ici, comme pour
 * `getLocations` (cf. `data/api/locations/locations.requests.ts`).
 */
export const getBackupServicesCatalog = async (ovhSubsidiary: string): Promise<OrderCatalog> =>
  getJSON<OrderCatalog>('v6', CATALOG_BACKUP_SERVICES_ROUTE, {
    params: { ovhSubsidiary },
  });
