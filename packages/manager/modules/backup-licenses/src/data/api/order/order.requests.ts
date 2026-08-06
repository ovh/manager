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

/**
 * Endpoints confirmés réels (2026-08-06) : la surface de commande Agora répond en production,
 * `POST /order/cartServiceOption/backupServices/{serviceName}` compris. Pas de garde
 * `USE_API_MOCKS` ici, comme pour le catalogue (cf. `data/api/catalog/catalog.requests.ts`).
 * Le catalogue `backupServices` n'y étant pas encore publié, ces appels peuvent répondre en
 * erreur ou à vide : les appelants dégradent, ils ne replient jamais sur une valeur en dur.
 */

export const getBackupServicesOffers = (serviceName: string): Promise<CartServiceOffer[]> =>
  getJSON<CartServiceOffer[]>('v6', getCartServiceOptionRoute(serviceName));

export const createOrderCart = (ovhSubsidiary: string): Promise<Cart> =>
  postJSON<Cart>('v6', ORDER_CART_ROUTE, { ovhSubsidiary });

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
