import {
  AVAILABLE_FILTERS,
  FILTER_CHARACTER,
} from '../constants';

export default {
  [FILTER_CHARACTER]: AVAILABLE_FILTERS.region,
  billing: {
    CA: 'https://ca.ovh.com/manager/index.html#/billing/history',
    EU: 'https://www.ovh.com/manager/dedicated/index.html#/billing/history',
    US: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/history',
  },
  billingCredits: {
    CA: 'https://ca.ovh.com/manager/index.html#/billing/credits',
    EU: 'https://www.ovh.com/manager/dedicated/index.html#/billing/credits',
    US: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/credits',
  },
  billingFidelity: {
    CA: 'https://ca.ovh.com/manager/index.html#/billing/fidelity',
    EU: 'https://www.ovh.com/manager/dedicated/index.html#/billing/fidelity',
    US: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/fidelity',
  },
  billingMean: {
    CA: 'https://ca.ovh.com/manager/index.html#/billing/mean',
    EU: 'https://www.ovh.com/manager/dedicated/index.html#/billing/mean',
    US: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/mean',
  },
  billingOrders: {
    CA: 'https://ca.ovh.com/manager/index.html#/billing/orders',
    EU: 'https://www.ovh.com/manager/dedicated/index.html#/billing/orders',
    US: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/orders',
  },
  billingOrdersInProgress: {
    CA: 'https://ca.ovh.com/manager/index.html#/billing/orders?status=in-progress',
    EU: 'https://www.ovh.com/manager/dedicated/index.html#/billing/orders?status=in-progress',
    US: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/orders?status=in-progress',
  },
  billingPayments: {
    CA: 'https://ca.ovh.com/manager/index.html#/billing/payments',
    EU: 'https://www.ovh.com/manager/dedicated/index.html#/billing/payments',
    US: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/payments',
  },
  billingRefunds: {
    CA: 'https://ca.ovh.com/manager/index.html#/billing/refunds',
    EU: 'https://www.ovh.com/manager/dedicated/index.html#/billing/refunds',
    US: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/refunds',
  },
  billingVoucher: {
    CA: 'https://ca.ovh.com/manager/index.html#//billing/voucher',
    EU: 'https://www.ovh.com/manager/dedicated/index.html#/billing/voucher',
    US: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/voucher',
  },
  managerDedicated: {
    EU: 'https://www.ovh.com/manager/dedicated/index.html',
    US: 'https://us.ovhcloud.com/manager/dedicated/index.html',
  },
  support: {
    CA: 'https://ca.ovh.com/manager/index.html#/support',
    EU: 'https://www.ovh.com/manager/dedicated/index.html#/support',
    US: 'https://us.ovhcloud.com/manager/dedicated/index.html#/support',
  },
};
