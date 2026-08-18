import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getBackupServicesOffers } from '@/data/api/order/order.requests';
import { queryKeys } from '@/data/queries/queryKeys';
import { tenantsQueries } from '@/data/queries/tenants.queries';
import { BACKUP_LICENSES_ORDERABLE_VAULT_PLAN_CODE } from '@/module.constants';
import { CartServiceOffer } from '@/types/OrderCart.type';
import { findServiceOffer, getOfferInstallationPriceText } from '@/utils/serviceOffer/serviceOffer';

const selectVaultOfferPriceText = (offers: CartServiceOffer[]): string | undefined =>
  getOfferInstallationPriceText(
    findServiceOffer(offers, BACKUP_LICENSES_ORDERABLE_VAULT_PLAN_CODE),
  );

export const useVaultOrderPrice = (): { priceText?: string; isPending: boolean } => {
  const queryClient = useQueryClient();

  const { data: serviceIds, isPending: isServiceNamePending } = useQuery({
    ...tenantsQueries.withClient(queryClient).serviceIds(),
    retry: false,
  });
  const serviceName = serviceIds?.backupServicesId;

  const { data: priceText, isPending: arePricesPending } = useQuery({
    queryKey: queryKeys.order.serviceOffers(serviceName ?? ''),
    queryFn: () => getBackupServicesOffers(serviceName as string),
    enabled: !!serviceName,
    retry: false,
    staleTime: Infinity,
    select: selectVaultOfferPriceText,
  });

  return { priceText, isPending: isServiceNamePending || (!!serviceName && arePricesPending) };
};
