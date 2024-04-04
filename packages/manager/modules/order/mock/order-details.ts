import { Handler } from '../../../../../playwright-helpers';
import { OrderData, OrderDetail } from '../src';
import { getParamsFromUrl } from '../../../../../playwright-helpers/network';

const orderList = [1, 2, 3];

const orderDetailsVrack = [930000001];
const orderDetailsVrackServices = [930000002];
const orderDetailsVrackAndOther = [930000003, 930000001];

const orderDataById: { [orderId: string]: OrderData } = {
  '1': {
    expirationDate: '2014-05-22T10:34:02+02:00',
    retractionDate: null,
    priceWithoutTax: {
      currencyCode: 'EUR',
      text: '1583.88 €',
      value: 1583.88,
    },
    date: '2014-05-21T10:34:02+02:00',
    password: 'zaxb',
    orderId: 1,
    tax: {
      currencyCode: 'EUR',
      value: 316.78,
      text: '316.78 €',
    },
    pdfUrl:
      'https://www.ovh.com/cgi-bin/order/display-order.cgi?orderId=28035678&orderPassword=zaxb',
    url:
      'https://www.ovh.com/cgi-bin/order/display-order.cgi?orderId=28035678&orderPassword=zaxb',
    priceWithTax: {
      currencyCode: 'EUR',
      value: 1900.66,
      text: '1900.66 €',
    },
  },
  '2': {
    expirationDate: '2014-05-22T10:34:02+02:00',
    retractionDate: null,
    priceWithoutTax: {
      currencyCode: 'EUR',
      text: '1583.88 €',
      value: 1583.88,
    },
    date: '2014-05-21T10:34:02+02:00',
    password: 'zaxb',
    orderId: 1,
    tax: {
      currencyCode: 'EUR',
      value: 316.78,
      text: '316.78 €',
    },
    pdfUrl:
      'https://www.ovh.com/cgi-bin/order/display-order.cgi?orderId=28035678&orderPassword=zaxb',
    url:
      'https://www.ovh.com/cgi-bin/order/display-order.cgi?orderId=28035678&orderPassword=zaxb',
    priceWithTax: {
      currencyCode: 'EUR',
      value: 1900.66,
      text: '1900.66 €',
    },
  },
  '3': {
    expirationDate: '2014-05-22T10:34:02+02:00',
    retractionDate: null,
    priceWithoutTax: {
      currencyCode: 'EUR',
      text: '1583.88 €',
      value: 1583.88,
    },
    date: '2014-05-21T10:34:02+02:00',
    password: 'zaxb',
    orderId: 1,
    tax: {
      currencyCode: 'EUR',
      value: 316.78,
      text: '316.78 €',
    },
    pdfUrl:
      'https://www.ovh.com/cgi-bin/order/display-order.cgi?orderId=28035678&orderPassword=zaxb',
    url:
      'https://www.ovh.com/cgi-bin/order/display-order.cgi?orderId=28035678&orderPassword=zaxb',
    priceWithTax: {
      currencyCode: 'EUR',
      value: 1900.66,
      text: '1900.66 €',
    },
  },
};

const orderDetailsById: { [detailid: string]: OrderDetail } = {
  '930000001': {
    domain: 'pn-0000000',
    detailType: 'INSTALLATION',
    quantity: '1',
    totalPrice: { text: '0 PTS', currencyCode: 'points', value: 0 },
    cancelled: false,
    unitPrice: { text: '0 PTS', currencyCode: 'points', value: 0 },
    description: 'vRack',
    orderDetailId: 930000001,
  },
  '930000002': {
    detailType: 'INSTALLATION',
    quantity: '1',
    totalPrice: { text: '0 PTS', currencyCode: 'points', value: 0 },
    cancelled: false,
    unitPrice: { text: '0 PTS', currencyCode: 'points', value: 0 },
    description: 'vRack Services',
    orderDetailId: 930000002,
  },
  '930000003': {
    detailType: 'DURATION',
    orderDetailId: 930000003,
    description: 'OS Linux Monthly fees',
    quantity: '1',
    domain: '*000.000',
    cancelled: false,
    unitPrice: { currencyCode: 'EUR', value: 0, text: '0.00 €' },
    totalPrice: { text: '0.00 €', value: 0, currencyCode: 'EUR' },
  },
};

export type GetOrderDetailsMocksParams = {
  delayedOrders?: boolean;
  deliveringVrackOrders?: boolean;
  deliveringVrackServicesOrders?: boolean;
};

export const getOrderDetailsMocks = ({
  delayedOrders,
  deliveringVrackOrders,
  deliveringVrackServicesOrders,
}: GetOrderDetailsMocksParams): Handler[] => [
  {
    url: '/me/order/:id/details/:detailid',
    response: (request: Request, params: { id: string; detailid: string }) => {
      const detailid =
        (params || getParamsFromUrl(request, { id: -3, detailid: -1 }))
          ?.detailid || request.url.split('/').pop();
      return orderDetailsById[Number(detailid)] || orderDetailsById[930000003];
    },
    api: 'v6',
  },
  {
    url: '/me/order/1/details',
    response: orderDetailsVrack,
    api: 'v6',
  },
  {
    url: '/me/order/1/status',
    response: deliveringVrackOrders ? 'delivering' : 'delivered',
    api: 'v6',
  },
  {
    url: '/me/order/2/details',
    response: orderDetailsVrackServices,
    api: 'v6',
  },
  {
    url: '/me/order/2/status',
    response: deliveringVrackServicesOrders ? 'delivering' : 'delivered',
    api: 'v6',
  },
  {
    url: '/me/order/3/details',
    response: orderDetailsVrackAndOther,
    api: 'v6',
  },
  {
    url: '/me/order/3/status',
    response: deliveringVrackOrders ? 'delivering' : 'delivered',
    api: 'v6',
  },
  {
    url: '/me/order/:id',
    response: (request: Request, params: { id: string }) =>
      orderDataById[
        (params || getParamsFromUrl(request, { id: -1 })).id || '1'
      ],
    api: 'v6',
  },
  {
    url: '/me/order',
    response: delayedOrders ? [] : orderList,
    api: 'v6',
    once: true,
  },
  {
    url: '/me/order',
    response: orderList,
    api: 'v6',
  },
];
