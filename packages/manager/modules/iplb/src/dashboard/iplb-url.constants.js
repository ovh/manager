export const RENEW_URL = {
  EU:
    'https://www.ovh.com/manager/dedicated/#/billing/autoRenew?selectedType={serviceType}&searchText={serviceName}',
  CA:
    'https://ca.ovh.com/manager/dedicated/#/billing/autorenew?selectedType={serviceType}&searchText={serviceName}',
};

export const CONTACTS_URL = {
  EU:
    'https://www.ovh.com/manager/dedicated/#/useraccount/contacts?tab=SERVICES&serviceName={serviceName}',
  CA:
    'https://ca.ovh.com/manager/dedicated/#/useraccount/contacts?tab=SERVICES&serviceName={serviceName}',
};

export const GUIDE_HOME_URL = 'https://docs.ovh.com';

export default {
  CONTACTS_URL,
  GUIDE_HOME_URL,
  RENEW_URL,
};
