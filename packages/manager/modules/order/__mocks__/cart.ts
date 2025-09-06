import { Handler } from '../../../../../playwright-helpers';
import { Cart, Item } from '../src';
import { getParamsFromUrl } from '../../../../../playwright-helpers/network';

const getCart = (): Cart => {
  const expire = new Date();
  expire.setDate(expire.getDate() + 1);

  return {
    cartId: `cartId-${expire.getTime()}`,
    description: '',
    expire: expire.toISOString(),
    readOnly: false,
    items: [],
  };
};

const getVrackItem = (request: Request, params: { id: string }): Item => ({
  cartId: (params || getParamsFromUrl(request, { id: -2 }))?.id,
  configurations: [],
  duration: 'P1M',
  itemId: 111111111,
  offerId: null as unknown as string,
  options: [],
  prices: [
    {
      label: 'TOTAL',
      price: {
        currencyCode: 'EUR',
        priceInUcents: 0,
        text: '0.00 €',
        value: 0,
      },
    },
  ],
  productId: 'vrack',
  settings: {
    planCode: 'vrack',
    pricingMode: 'default',
    quantity: 1,
  },
});

const getVrackServicesItem = (
  request: Request,
  params: { id: string },
): Item => ({
  cartId: (params || getParamsFromUrl(request, { id: -2 }))?.id,
  configurations: [],
  duration: 'P1M',
  itemId: 222222222,
  offerId: null as unknown as string,
  options: [],
  prices: [
    {
      label: 'TOTAL',
      price: {
        currencyCode: 'EUR',
        priceInUcents: 0,
        text: '0.00 €',
        value: 0,
      },
    },
  ],
  productId: 'vrackServices',
  settings: {
    planCode: 'vrackServices',
    pricingMode: 'default',
    quantity: 1,
  },
});

export type GetCartMocksParams = {
  vrackOrderKo?: boolean;
  vrackServicesOrderKo?: boolean;
};

export const getCartMocks = ({
  vrackOrderKo,
  vrackServicesOrderKo,
}: GetCartMocksParams): Handler[] => [
  {
    url: '/order/cart/:id/assign',
    method: 'post',
    api: 'v6',
  },
  {
    url: '/order/cart/:id/vrackServices',
    method: 'post',
    response: (request: Request, params: { id: string }) =>
      vrackServicesOrderKo
        ? {
            status: 403,
            code: 'ERR_VRACK_SERVICES',
            response: {
              data: { message: 'Error Vrack Services' },
            },
          }
        : getVrackServicesItem(request, params),
    status: vrackServicesOrderKo ? 403 : 200,
    api: 'v6',
  },
  {
    url: '/order/cart/:id/vrack',
    method: 'post',
    response: (request: Request, params: { id: string }) =>
      vrackOrderKo
        ? {
            status: 403,
            code: 'ERR_MAX_VRACKS',
            response: {
              data: { message: 'You already own 60 vRacks, maximum is 60' },
            },
          }
        : getVrackItem(request, params),
    status: vrackOrderKo ? 403 : 200,
    api: 'v6',
  },
  {
    url: '/order/cart/:cartid/item/:itemid/configuration',
    method: 'post',
    response: {},
    api: 'v6',
  },
  {
    url: '/order/cart/:id/checkout',
    method: 'post',
    response: { orderId: 1, url: 'https://order.com' },
    api: 'v6',
  },
  {
    url: '/order/cart/:id/checkout',
    response: {
      contracts: [
        { content: '', name: 'contract1', url: 'https://contract1.com' },
        { content: '', name: 'contract2', url: 'https://contract2.com' },
      ],
      orderId: 1,
      details: [],
    },
    api: 'v6',
  },
  {
    url: '/order/cart',
    method: 'post',
    response: getCart,
    api: 'v6',
  },
];
