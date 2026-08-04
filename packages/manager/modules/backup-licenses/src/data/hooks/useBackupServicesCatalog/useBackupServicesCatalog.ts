import { useContext } from 'react';

import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { getBackupServicesCatalog } from '@/data/api/catalog/catalog.requests';
import { queryKeys } from '@/data/queries/queryKeys';
import { OrderCatalog } from '@/types/Catalog.type';

/** Catalogue Agora public du produit, pour les prix dynamiques du tunnel de commande (BKP-1208). */
export const useBackupServicesCatalog = (): UseQueryResult<OrderCatalog> => {
  const { environment } = useContext(ShellContext);
  const ovhSubsidiary = environment.getUser().ovhSubsidiary;

  return useQuery({
    queryKey: queryKeys.catalog.backupServices(ovhSubsidiary),
    queryFn: () => getBackupServicesCatalog(ovhSubsidiary),
    // Catalogue public : pas de raison de le rafraîchir pendant la session.
    staleTime: Infinity,
  });
};
