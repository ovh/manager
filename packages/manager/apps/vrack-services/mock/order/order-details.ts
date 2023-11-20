export const orderList = [1, 2, 3];

export const orderDetailsVrack = [930000001];
export const orderDetailsVrackServices = [930000002];
export const orderDetailsOther = [930000003, 930000001];

export const vrackOrderDetail = {
  domain: 'pn-0000000',
  detailType: 'INSTALLATION',
  quantity: '1',
  totalPrice: { text: '0 PTS', currencyCode: 'points', value: 0 },
  cancelled: false,
  unitPrice: { text: '0 PTS', currencyCode: 'points', value: 0 },
  description: 'vRack',
  orderDetailId: 930000001,
};

export const vrackServicesOrderDetail = {
  detailType: 'INSTALLATION',
  quantity: '1',
  totalPrice: { text: '0 PTS', currencyCode: 'points', value: 0 },
  cancelled: false,
  unitPrice: { text: '0 PTS', currencyCode: 'points', value: 0 },
  description: 'vRack Services',
  orderDetailId: 930000002,
};

export const otherOrderDetail = {
  detailType: 'DURATION',
  orderDetailId: 930200003,
  description: 'OS Linux Monthly fees',
  quantity: '1',
  domain: '*000.000',
  cancelled: false,
  unitPrice: { currencyCode: 'EUR', value: 0, text: '0.00 €' },
  totalPrice: { text: '0.00 €', value: 0, currencyCode: 'EUR' },
};
