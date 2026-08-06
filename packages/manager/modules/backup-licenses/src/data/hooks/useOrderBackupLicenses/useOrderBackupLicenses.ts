import { useContext } from 'react';

import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { TApiCustomError } from '@ovh-ux/manager-core-api';
import { Contract, Order } from '@ovh-ux/manager-module-order';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import {
  addBackupServicesCartItem,
  addBackupServicesCartItemOption,
  assignOrderCart,
  configureCartItem,
  createOrderCart,
  executeOrderCartCheckout,
  getCartItemRequiredConfiguration,
  getOrderCartCheckout,
} from '@/data/api/order/order.requests';
import { queryKeys } from '@/data/queries/queryKeys';
import { LicenseApiValue, ServerVaultFormState } from '@/types/Order.type';
import { planCartConfigurations } from '@/utils/cartConfiguration/cartConfiguration';
import { buildBackupLicensesOrderComposition } from '@/utils/orderComposition/orderComposition';

export const UNKNOWN_CART_CONFIGURATION = 'unknown required cart configuration';

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

/**
 * Les labels de configuration se découvrent item par item : le catalogue décide lequel du tenant,
 * des addons VSPC ou du vault porte le nom du serveur, la région ou l'édition de licence. On envoie
 * donc à chacun ce qu'il réclame, et un label réclamé sans valeur candidate arrête la commande —
 * poster un panier incomplet livrerait un service à moitié configuré.
 */
const configureItemFromRequirements = async (
  cartId: string,
  itemId: number,
  values: Record<string, string | undefined>,
): Promise<void> => {
  const requirements = await getCartItemRequiredConfiguration(cartId, itemId);
  const { configurations, missingLabels } = planCartConfigurations(requirements, values);

  if (missingLabels.length > 0) {
    throw new Error(`${UNKNOWN_CART_CONFIGURATION}: ${missingLabels.join(', ')}`);
  }

  await Promise.all(
    configurations.map((configuration) => configureCartItem(cartId, itemId, configuration)),
  );
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
  await configureItemFromRequirements(cartId, itemId, configurationValues);

  // Séquentiel, dans l'ordre de R2 : `Promise.all` (ce que fait `createCart`) les ajouterait
  // en parallèle, alors que le catalogue peut conditionner un addon à la présence du précédent.
  for (const addon of addons) {
    const option = await addBackupServicesCartItemOption(cartId, { itemId, ...addon });
    await configureItemFromRequirements(cartId, option.itemId, configurationValues);
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
