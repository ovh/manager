import { useContext } from 'react';

import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { TApiCustomError } from '@ovh-ux/manager-core-api';
import { Contract, Order } from '@ovh-ux/manager-module-order';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import {
  addBackupServicesCartItem,
  addBackupServicesCartItemOption,
  assignOrderCart,
  configureCartItemFromRequirements,
  createOrderCart,
  executeOrderCartCheckout,
  getOrderCartCheckout,
} from '@/data/api/order/order.requests';
import { queryKeys } from '@/data/queries/queryKeys';
import { LicenseApiValue, ServerVaultFormState } from '@/types/Order.type';
import { buildBackupLicensesOrderComposition } from '@/utils/orderComposition/orderComposition';

export type BackupLicensesOrder = {
  form: ServerVaultFormState;
  licenseType: LicenseApiValue;
};

export type BackupLicensesOrderResult = {
  cartId: string;
  /** CGV du panier (R5) : rendues ou non, elles remontent au parcours dès qu'il en veut. */
  contractList: Contract[];
  order: Order;
};

const placeBackupLicensesOrder = async ({
  ovhSubsidiary,
  form,
  licenseType,
}: BackupLicensesOrder & { ovhSubsidiary: string }): Promise<BackupLicensesOrderResult> => {
  const { product, addons, configurationValues } = buildBackupLicensesOrderComposition(
    form,
    licenseType,
  );

  const { cartId } = await createOrderCart(ovhSubsidiary);
  const { itemId } = await addBackupServicesCartItem(cartId, product);
  await configureCartItemFromRequirements(cartId, itemId, configurationValues);

  // Séquentiel, dans l'ordre de R2 : `Promise.all` (ce que fait `createCart`) les ajouterait
  // en parallèle, alors que le catalogue peut conditionner un addon à la présence du précédent.
  for (const addon of addons) {
    const option = await addBackupServicesCartItemOption(cartId, { itemId, ...addon });
    await configureCartItemFromRequirements(cartId, option.itemId, configurationValues);
  }

  await assignOrderCart(cartId);

  // Le GET simule : c'est là que les contrats sont connus, et le point de coupure si les CGV
  // doivent un jour être acceptées avant l'engagement (R5, décision PO ouverte).
  const { contracts } = await getOrderCartCheckout(cartId);
  const order = await executeOrderCartCheckout(cartId);

  return { cartId, contractList: contracts, order };
};

/**
 * Commande du premier abonnement (BKP-1208) : compose le panier Agora depuis l'état du formulaire,
 * le configure, l'assigne et l'exécute. Un échec à n'importe quelle étape rejette sans rien
 * rattraper — la page garde la saisie et son brouillon, le client réessaie.
 */
export const useOrderBackupLicenses = ({
  onSuccess,
}: {
  onSuccess: () => void;
}): UseMutationResult<BackupLicensesOrderResult, TApiCustomError, BackupLicensesOrder> => {
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: BackupLicensesOrder) =>
      placeBackupLicensesOrder({ ...order, ovhSubsidiary }),
    onSuccess: async () => {
      // Le compte n'avait pas de service : les réponses « aucun abonnement » en cache doivent
      // partir avant que la page de destination ne les relise.
      await queryClient.invalidateQueries({ queryKey: queryKeys.subscription.active() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.backupServices.tenants() });
      onSuccess();
    },
  });
};
