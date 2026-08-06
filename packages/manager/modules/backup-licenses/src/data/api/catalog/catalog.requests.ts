import { getJSON } from '@/data/api/Client.api';
import { OrderCatalog } from '@/types/Catalog.type';
import { CATALOG_BACKUP_SERVICES_ROUTE } from '@/utils/apiRoutes/apiRoutes';

export const getBackupServicesCatalog = async (ovhSubsidiary: string): Promise<OrderCatalog> =>
  getJSON<OrderCatalog>('v6', CATALOG_BACKUP_SERVICES_ROUTE, {
    params: { ovhSubsidiary },
  });
