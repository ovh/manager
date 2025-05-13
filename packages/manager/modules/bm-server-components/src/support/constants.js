export const SUPPORT_LEVELS = {
  standard: 'Standard',
  premium: 'Premium',
  'premium-accredited': 'Premium Advanced',
  business: 'Business',
  enterprise: 'Enterprise',
};

const rootSupportUrl = 'https://help.ovhcloud.com/';

export const SUPPORT_URLS = {
  viewTickets: `${rootSupportUrl}csm?id=csm_cases_requests&ovhSubsidiary=`,
  createTicket: `${rootSupportUrl}csm?id=csm_get_help&ovhSubsidiary=`,
};

export default {
  SUPPORT_LEVELS,
  SUPPORT_URLS,
};
