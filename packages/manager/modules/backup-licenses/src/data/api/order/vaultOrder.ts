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

export const buildVaultOrderConfigurationValues = ({
  name,
  region,
}: VaultOrder): Record<string, string> => ({
  'vault-name': name,
  'vault-azname': region,
});

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
  await assignOrderCart(cartId);
  const { itemId } = await addBackupServicesOption(serviceName, { cartId, ...orderParameters });
  await configureCartItemFromRequirements(
    cartId,
    itemId,
    buildVaultOrderConfigurationValues(order),
  );

  await getOrderCartCheckout(cartId);
  await executeOrderCartCheckout(cartId);
};
