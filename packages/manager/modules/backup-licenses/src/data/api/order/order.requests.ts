import {
  Cart,
  ConfigurationItem,
  CreateCartResult,
  Item,
  Order,
  createCart,
} from '@ovh-ux/manager-module-order';

import { getJSON, postJSON } from '@/data/api/Client.api';
import {
  CartItemConfiguration,
  CartItemOptionCreation,
  CartItemRequiredConfiguration,
  CartOfferDefinition,
  CartOfferOrderParameters,
  CartServiceOffer,
  CartServiceOptionCreation,
} from '@/types/OrderCart.type';
import {
  BACKUP_SERVICES_CART_ITEM_ENDPOINT,
  ORDER_CART_ROUTE,
  getBackupServicesCartItemRoute,
  getBackupServicesCartOptionRoute,
  getCartItemConfigurationRoute,
  getCartItemRequiredConfigurationRoute,
  getCartServiceOptionRoute,
  getOrderCartAssignRoute,
  getOrderCartCheckoutRoute,
} from '@/utils/apiRoutes/apiRoutes';
import { planCartConfigurations } from '@/utils/cartConfiguration/cartConfiguration';
import { BackupLicensesOrderNode } from '@/utils/orderComposition/orderComposition';
import { findServiceOffer, getOfferOrderParameters } from '@/utils/serviceOffer/serviceOffer';

/**
 * Le catalogue `backupServices` répond sur labeu mais pas encore en production (401) : ces appels
 * peuvent y répondre en erreur ou à vide, et les appelants dégradent — ils ne replient jamais sur
 * une valeur en dur.
 */

export const getBackupServicesOffers = (serviceName: string): Promise<CartServiceOffer[]> =>
  getJSON<CartServiceOffer[]>('v6', getCartServiceOptionRoute(serviceName));

export const createOrderCart = (ovhSubsidiary: string): Promise<Cart> =>
  postJSON<Cart>('v6', ORDER_CART_ROUTE, { ovhSubsidiary });

export const getBackupServicesCartProductDefinitions = (
  cartId: string,
): Promise<CartOfferDefinition[]> =>
  getJSON<CartOfferDefinition[]>('v6', getBackupServicesCartItemRoute(cartId));

export const getBackupServicesCartOptionDefinitions = (
  cartId: string,
  productPlanCode: string,
): Promise<CartServiceOffer[]> =>
  getJSON<CartServiceOffer[]>('v6', getBackupServicesCartOptionRoute(cartId), {
    params: { planCode: productPlanCode },
  });

export const addBackupServicesOption = (
  serviceName: string,
  body: CartServiceOptionCreation,
): Promise<Item> => postJSON<Item>('v6', getCartServiceOptionRoute(serviceName), body);

export const addBackupServicesCartItem = (
  cartId: string,
  body: CartOfferOrderParameters,
): Promise<Item> => postJSON<Item>('v6', getBackupServicesCartItemRoute(cartId), body);

export const addBackupServicesCartItemOption = (
  cartId: string,
  body: CartItemOptionCreation,
): Promise<Item> => postJSON<Item>('v6', getBackupServicesCartOptionRoute(cartId), body);

export const getCartItemRequiredConfiguration = (
  cartId: string,
  itemId: number,
): Promise<CartItemRequiredConfiguration[]> =>
  getJSON<CartItemRequiredConfiguration[]>(
    'v6',
    getCartItemRequiredConfigurationRoute(cartId, itemId),
  );

export const configureCartItem = (
  cartId: string,
  itemId: number,
  configuration: CartItemConfiguration,
): Promise<ConfigurationItem> =>
  postJSON<ConfigurationItem>('v6', getCartItemConfigurationRoute(cartId, itemId), configuration);

export const assignOrderCart = (cartId: string): Promise<void> =>
  postJSON<void>('v6', getOrderCartAssignRoute(cartId), { cartId });

/** Simulation : le checkout en GET rend contrats et prix sans rien engager. */
export const getOrderCartCheckout = (cartId: string): Promise<Order> =>
  getJSON<Order>('v6', getOrderCartCheckoutRoute(cartId));

/**
 * Le seul appel qui engage la commande. Les deux drapeaux reprennent ceux du produit frère sur
 * le même canal Agora (`bmc-backup-agent-baremetal`, `useCheckoutBackupAgentCart`) : sans
 * `autoPayWithPreferredPaymentMethod`, la commande part impayée et le service n'est jamais livré.
 */
export const executeOrderCartCheckout = (cartId: string): Promise<Order> =>
  postJSON<Order>('v6', getOrderCartCheckoutRoute(cartId), {
    autoPayWithPreferredPaymentMethod: true,
    waiveRetractationPeriod: true,
  });

export const UNKNOWN_CART_CONFIGURATION = 'unknown required cart configuration';

/**
 * Les labels de configuration se découvrent item par item : le catalogue décide lequel du tenant,
 * des addons VSPC ou du vault porte le nom, la région ou l'édition de licence. On envoie donc à
 * chacun ce qu'il réclame, et un label réclamé sans valeur candidate arrête la commande — poster un
 * panier incomplet livrerait un service à moitié configuré.
 */
export const configureCartItemFromRequirements = async (
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

export const UNAVAILABLE_CART_OFFER = 'no orderable cart offer for plan code';

export type ResolvedOrderNode = CartOfferOrderParameters & {
  options: ResolvedOrderNode[];
};

/** Chaque niveau s'interroge sous son propre parent : les options d'un addon ne sont pas celles du tenant. */
const resolveOrderNodeOptions = async (
  cartId: string,
  parentPlanCode: string,
  nodes: readonly BackupLicensesOrderNode[],
  unavailablePlanCodes: string[],
): Promise<ResolvedOrderNode[]> => {
  if (nodes.length === 0) return [];

  const definitions = await getBackupServicesCartOptionDefinitions(cartId, parentPlanCode);
  const resolved: ResolvedOrderNode[] = [];

  for (const node of nodes) {
    const parameters = getOfferOrderParameters(findServiceOffer(definitions, node.planCode));

    if (!parameters) {
      unavailablePlanCodes.push(node.planCode);
      continue;
    }

    resolved.push({
      ...parameters,
      options: await resolveOrderNodeOptions(
        cartId,
        node.planCode,
        node.options,
        unavailablePlanCodes,
      ),
    });
  }

  return resolved;
};

/**
 * `pricingMode` et `duration` se lisent sur les plans que le panier offre, ils ne se supposent pas :
 * le `default`/`P1M` mensuel de l'item principal n'est pas le contrat d'un addon à la consommation.
 * Un plan de la composition que le panier n'offre pas, ou dont aucun tarif n'est commandable, arrête
 * la commande ici en le nommant — le POST partirait de toute façon en erreur, mais sans dire lequel.
 */
export const discoverBackupServicesOrderParameters = async (
  cartId: string,
  product: BackupLicensesOrderNode,
): Promise<ResolvedOrderNode> => {
  const definitions = await getBackupServicesCartProductDefinitions(cartId);
  const parameters = getOfferOrderParameters(findServiceOffer(definitions, product.planCode));

  if (!parameters) {
    throw new Error(`${UNAVAILABLE_CART_OFFER}: ${product.planCode}`);
  }

  const unavailablePlanCodes: string[] = [];
  const options = await resolveOrderNodeOptions(
    cartId,
    product.planCode,
    product.options,
    unavailablePlanCodes,
  );

  if (unavailablePlanCodes.length > 0) {
    throw new Error(`${UNAVAILABLE_CART_OFFER}: ${unavailablePlanCodes.join(', ')}`);
  }

  return { ...parameters, options };
};

export type BackupServicesCartProduct = CartOfferOrderParameters & {
  configurations?: CartItemConfiguration[];
};

export type CreateBackupServicesCartParams = {
  ovhSubsidiary: string;
  product: BackupServicesCartProduct;
  addons?: BackupServicesCartProduct[];
};

/**
 * Panier complet en un appel — `createCart` enchaîne lui-même panier, item, configurations,
 * addons, `assign` et `checkout`. Les primitives ci-dessus servent le cas qu'il ne couvre pas :
 * une commande sur service existant, dont l'item passe par `cartServiceOption`.
 */
export const createBackupServicesCart = ({
  ovhSubsidiary,
  product: { configurations, ...productParameters },
  addons,
}: CreateBackupServicesCartParams): Promise<CreateCartResult> =>
  createCart({
    ovhSubsidiary,
    items: [
      {
        itemEndpoint: BACKUP_SERVICES_CART_ITEM_ENDPOINT,
        options: productParameters,
        configurations,
        productOptions: addons,
      },
    ],
  });
