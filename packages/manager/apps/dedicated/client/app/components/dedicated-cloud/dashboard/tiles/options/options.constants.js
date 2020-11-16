// value returns by GET /me/order/{orderId}/status
export const ORDER_STATUS = {
  cancelled: 'cancelled',
  cancelling: 'cancelling',
  checking: 'checking',
  delivered: 'delivered',
  delivering: 'delivering',
  documentsRequested: 'documentsRequested',
  notPaid: 'notPaid',
  unknown: 'unknown',
};

export default {
  ORDER_STATUS,
};
