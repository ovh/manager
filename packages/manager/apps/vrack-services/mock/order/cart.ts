import { Handler } from '@super-components/_common/msw-helpers';
import { Cart, Item } from '@/api/order/order.type';
import { ResponseData } from '@/api/api.type';

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

const getVrackItem = (data: { params: { id: string } }): Item => ({
  cartId: data?.params?.id,
  configurations: [],
  duration: 'P1M',
  itemId: 111111111,
  offerId: null,
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

const getVrackServicesItem = (data: { params: { id: string } }): Item => ({
  cartId: data?.params?.id,
  configurations: [],
  duration: 'P1M',
  itemId: 222222222,
  offerId: null,
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
    url: '/order/cart',
    method: 'post',
    response: getCart,
    api: 'v6',
  },
  {
    url: '/order/cart/:id/assign',
    method: 'post',
    api: 'v6',
  },
  {
    url: '/order/cart/:id/vrack',
    method: 'post',
    response: getVrackItem,
    api: 'v6',
  },
  {
    url: '/order/cart/:id/vrackServices',
    method: 'post',
    response: getVrackServicesItem,
    api: 'v6',
  },
  {
    url: '/order/cart/:id/checkout',
    method: 'post',
    response: vrackServicesOrderKo
      ? ({
          status: 403,
          code: 'ERR_VRACK_SERVICES',
          data: null,
          response: {
            data: { message: 'Error Vrack Services' },
          },
        } as ResponseData<unknown>)
      : { orderId: 1 },
    status: vrackServicesOrderKo ? 403 : 200,
    api: 'v6',
    once: true,
  },
  {
    url: '/order/cart/:id/checkout',
    method: 'post',
    response: vrackOrderKo
      ? ({
          status: 403,
          code: 'ERR_MAX_VRACKS',
          data: null,
          response: {
            data: { message: 'You already own 60 vRacks, maximum is 60' },
          },
        } as ResponseData<unknown>)
      : { orderId: 2 },
    status: vrackOrderKo ? 403 : 200,
    api: 'v6',
    once: true,
  },
  {
    url: '/order/cart/:id/checkout',
    method: 'post',
    response: { orderId: 1 },
    api: 'v6',
  },
];
