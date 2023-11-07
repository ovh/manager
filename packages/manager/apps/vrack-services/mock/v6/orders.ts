import { Cart, Item } from '../../src/api/order/order.type';

export const getCart = (): Cart => {
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

export const getVrackItem = (data: { params: { id: string } }): Item => ({
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

export const getVrackServicesItem = (data: {
  params: { id: string };
}): Item => ({
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
