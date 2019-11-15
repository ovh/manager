export const REDIRECT_URLS = {
  EU: {
    renew: 'https://www.ovh.com/manager/dedicated/index.html#/billing/autoRenew?selectedType={serviceType}&searchText={serviceName}',
    contacts: 'https://www.ovh.com/manager/dedicated/index.html#/useraccount/contacts?tab=SERVICES&serviceName={serviceName}',
  },
  CA: {
    renew: 'https://ca.ovh.com/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
    contacts: null,
  },
  US: {
    renew: 'https://us.ovhcloud.com/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
    contacts: null,
  },
};

export default {
  REDIRECT_URLS,
};
