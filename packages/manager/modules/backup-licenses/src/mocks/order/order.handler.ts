import { Handler } from '@ovh-ux/manager-core-test-utils';

import {
  mockCart,
  mockCartCheckout,
  mockCartItem,
  mockCartOptionDefinitions,
  mockCartProductDefinitions,
  mockCartRequiredConfiguration,
  mockCartServiceOffers,
  mockCartServiceOffersWithoutVault,
} from '@/mocks/order/order.mock';
import {
  CartItemRequiredConfiguration,
  CartOfferDefinition,
  CartServiceOffer,
} from '@/types/OrderCart.type';
import {
  CART_SERVICE_OPTION_BACKUP_SERVICES_ROUTE,
  ORDER_CART_ROUTE,
} from '@/utils/apiRoutes/apiRoutes';

export type TOrderMockParams = {
  serviceOffers?: CartServiceOffer[];
  /** Le service répond, mais l'offre cherchée n'y est pas. */
  isServiceOfferMissing?: boolean;
  isServiceOffersError?: boolean;
  isOrderError?: boolean;
  /** Statut des écritures en échec : un 400/409 dit « ce nom ne va pas », un 5xx parle du canal. */
  orderErrorStatus?: number;
  orderErrorMessage?: string;
  serviceOffersErrorStatus?: number;
  /** Retient les offres, le temps d'observer l'état de chargement des prix. */
  serviceOffersDelay?: number;
  /** Retient les écritures, le temps d'observer le CTA en cours de soumission. */
  orderDelay?: number;
  cartRequiredConfiguration?: CartItemRequiredConfiguration[];
  /** Les plans que le panier offre : en servir moins que la composition doit bloquer la commande. */
  cartProductDefinitions?: CartOfferDefinition[];
  cartOptionDefinitions?: CartServiceOffer[];
};

const ERROR_BODY = { message: 'Internal server error' };

export const getOrderMocks = ({
  serviceOffers,
  isServiceOfferMissing,
  isServiceOffersError,
  isOrderError,
  orderErrorStatus = 500,
  orderErrorMessage,
  serviceOffersErrorStatus = 500,
  serviceOffersDelay = 0,
  orderDelay = 0,
  cartRequiredConfiguration,
  cartProductDefinitions,
  cartOptionDefinitions,
}: TOrderMockParams): Handler[] => {
  const offers =
    serviceOffers ??
    (isServiceOfferMissing ? mockCartServiceOffersWithoutVault : mockCartServiceOffers);
  const orderError = orderErrorMessage ? { message: orderErrorMessage } : ERROR_BODY;

  const read = (url: string, response: unknown): Handler => ({
    url,
    response: () => response,
    api: 'v6',
    method: 'get',
    status: 200,
    delay: 0,
  });

  const write = (url: string, response: unknown): Handler => ({
    url,
    response: () => (isOrderError ? orderError : response),
    api: 'v6',
    method: 'post',
    status: isOrderError ? orderErrorStatus : 200,
    delay: orderDelay,
  });

  return [
    {
      url: `${CART_SERVICE_OPTION_BACKUP_SERVICES_ROUTE}/:serviceName`,
      response: () => (isServiceOffersError ? ERROR_BODY : offers),
      api: 'v6',
      method: 'get',
      status: isServiceOffersError ? serviceOffersErrorStatus : 200,
      delay: serviceOffersDelay,
    },
    write(`${CART_SERVICE_OPTION_BACKUP_SERVICES_ROUTE}/:serviceName`, mockCartItem),
    write(ORDER_CART_ROUTE, mockCart),
    read(
      `${ORDER_CART_ROUTE}/:cartId/backupServices`,
      cartProductDefinitions ?? mockCartProductDefinitions,
    ),
    read(
      `${ORDER_CART_ROUTE}/:cartId/backupServices/options`,
      cartOptionDefinitions ?? mockCartOptionDefinitions,
    ),
    write(`${ORDER_CART_ROUTE}/:cartId/backupServices`, mockCartItem),
    write(`${ORDER_CART_ROUTE}/:cartId/backupServices/options`, mockCartItem),
    write(`${ORDER_CART_ROUTE}/:cartId/item/:itemId/configuration`, {
      id: 1,
      label: 'test-label',
      value: 'test-value',
    }),
    write(`${ORDER_CART_ROUTE}/:cartId/assign`, null),
    {
      url: `${ORDER_CART_ROUTE}/:cartId/item/:itemId/requiredConfiguration`,
      response: () => cartRequiredConfiguration ?? mockCartRequiredConfiguration,
      api: 'v6',
      method: 'get',
      status: 200,
      delay: 0,
    },
    {
      url: `${ORDER_CART_ROUTE}/:cartId/checkout`,
      response: () => (isOrderError ? orderError : mockCartCheckout),
      api: 'v6',
      method: 'get',
      status: isOrderError ? orderErrorStatus : 200,
      delay: orderDelay,
    },
    // Même route, l'autre méthode : le GET simule, le POST engage.
    write(`${ORDER_CART_ROUTE}/:cartId/checkout`, mockCartCheckout),
  ];
};
