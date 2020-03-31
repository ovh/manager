export const REDIRECT_URLS = {
  EU: {
    renew:
      '#/billing/autoRenew?selectedType={serviceType}&searchText={serviceName}',
    contacts: '#/useraccount/contacts?tab=SERVICES&serviceName={serviceName}',
  },
  CA: {
    renew:
      'https://ca.ovh.com/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
    contacts: null,
  },
  US: {
    renew:
      'https://us.ovhcloud.com/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
    contacts: null,
  },
};

export default {
  REDIRECT_URLS,
};
