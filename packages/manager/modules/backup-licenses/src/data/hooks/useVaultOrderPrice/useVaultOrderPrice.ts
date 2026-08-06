import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getBackupServicesOffers } from '@/data/api/order/order.requests';
import { backupLicenseQueries } from '@/data/queries/backupLicense.queries';
import { queryKeys } from '@/data/queries/queryKeys';
import { BACKUP_LICENSES_ORDERABLE_VAULT_PLAN_CODE } from '@/module.constants';
import { CartServiceOffer } from '@/types/OrderCart.type';
import { findServiceOffer, getOfferInstallationPriceText } from '@/utils/serviceOffer/serviceOffer';

const selectVaultOfferPriceText = (offers: CartServiceOffer[]): string | undefined =>
  getOfferInstallationPriceText(
    findServiceOffer(offers, BACKUP_LICENSES_ORDERABLE_VAULT_PLAN_CODE),
  );

/**
 * Le tarif paygo affiché par la modale de commande, lu sur l'offre du service (R1) — la même offre,
 * et le même tarif, que ceux dont la soumission lira les paramètres de POST.
 *
 * `retry: false` et aucune remontée d'erreur : le catalogue `backupServices` n'étant pas déclaré,
 * l'appel répond couramment en erreur ou sans l'offre, et un tarif introuvable n'est pas un incident
 * à signaler au client — c'est un message en moins.
 */
export const useVaultOrderPrice = (): { priceText?: string; isPending: boolean } => {
  const queryClient = useQueryClient();

  const { data: serviceName, isPending: isServiceNamePending } = useQuery({
    ...backupLicenseQueries.withClient(queryClient).resourceName(),
    retry: false,
  });

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
