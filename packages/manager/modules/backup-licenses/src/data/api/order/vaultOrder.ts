import {
  addBackupServicesOption,
  assignOrderCart,
  configureCartItemFromRequirements,
  createOrderCart,
  executeOrderCartCheckout,
  getBackupServicesOffers,
  getOrderCartCheckout,
} from '@/data/api/order/order.requests';
import { BACKUP_LICENSES_ORDERABLE_VAULT_PLAN_CODE } from '@/module.constants';
import { VaultOrder, VaultOrderContext } from '@/types/Vault.type';
import { findServiceOffer, getOfferOrderParameters } from '@/utils/serviceOffer/serviceOffer';

export const VAULT_ORDER_OFFER_UNAVAILABLE = 'no orderable paygo vault offer on this service';

/**
 * Le vivier de valeurs apparié aux labels que le panier réclame, pas un corps de requête. Aucune
 * source ne nomme ces labels : chaque valeur est donc proposée sous toutes ses graphies plausibles —
 * celles du tunnel de commande et la snake_case du panier — et un label réclamé qu'aucune ne couvre
 * fait échouer la commande au lieu d'être deviné.
 */
export const buildVaultOrderConfigurationValues = ({
  name,
  region,
}: VaultOrder): Record<string, string> => ({
  vault_name: name,
  vaultDisplayName: name,
  displayName: name,
  vault_region: region,
  region,
});

/**
 * Commande d'un vault supplémentaire (BKP-1223) : une option achetée sur le service existant, donc
 * `cartServiceOption` et non un item de panier neuf. L'offre est *découverte* avant d'être commandée
 * — c'est elle qui porte le `pricingMode` et la `duration` du POST, qu'un produit à la consommation
 * ne partage pas avec le `default`/`P1M` du tunnel.
 */
export const placeVaultOrder = async (
  order: VaultOrder,
  { ovhSubsidiary, serviceName }: VaultOrderContext,
): Promise<void> => {
  const offers = await getBackupServicesOffers(serviceName);
  const orderParameters = getOfferOrderParameters(
    findServiceOffer(offers, BACKUP_LICENSES_ORDERABLE_VAULT_PLAN_CODE),
  );

  if (!orderParameters) throw new Error(VAULT_ORDER_OFFER_UNAVAILABLE);

  const { cartId } = await createOrderCart(ovhSubsidiary);
  const { itemId } = await addBackupServicesOption(serviceName, { cartId, ...orderParameters });
  await configureCartItemFromRequirements(
    cartId,
    itemId,
    buildVaultOrderConfigurationValues(order),
  );
  await assignOrderCart(cartId);

  // Même finalisation que le tunnel : le GET simule (contrats + prix, n'engage rien), le POST engage.
  await getOrderCartCheckout(cartId);
  await executeOrderCartCheckout(cartId);
};
