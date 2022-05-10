export const ORDER_URL = {
  EU: 'https://www.ovh.com/order/express/#/express/review?products=',
  CA: 'https://ca.ovh.com/order/express/#/express/review?products=',
  US: 'https://us.ovhcloud.com/order/express/#/express/review?products=',
};

export const GUIDE_URLS = {
  FAILOVER_IP: {
    DEFAULT: 'https://www.ovhcloud.com/en/bare-metal/ip/',
  },
  CONF_FAILOVER_IP: {
    FR: 'https://docs.ovh.com/fr/public-cloud/configurer_une_ip_failover/',
    DEFAULT:
      'https://docs.ovh.com/gb/en/public-cloud/make-failover-ip-configuration-persistent/',
  },
};

export const IP_TYPE_ENUM = {
  FAILOVER: 'failover_ip',
  // FLOATING: 'floating_ip'
};

export const REGIONS = {
  EU: 'EUROPE',
  CA: 'CANADA',
  US: 'USA',
};

export default {
  ORDER_URL,
  IP_TYPE_ENUM,
  REGIONS,
  GUIDE_URLS,
};
