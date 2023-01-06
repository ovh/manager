export const WARNING_MESSAGES = {
  noIpMessage: {
    message: 'pci_databases_general_information_no_ip',
    userLink: false,
  },
  noUserMessage: {
    message: 'pci_databases_general_information_no_users',
    userLink: true,
    linkMessage: 'pci_databases_general_information_manage_users',
  },
  noIpNoUserMessage: {
    message: 'pci_databases_general_information_no_ip_no_users',
    userLink: true,
    linkMessage: 'pci_databases_general_information_manage_users',
  },
};

export const KARAPACE_URL = 'https://karapace.io/';

export const NEW_SUPPORT_TICKET_PARAMS = {
  CATEGORY_NAME: 'assistance',
  BASE_SERVICE_TYPE: 'managed_',
};

export const TRANSLATION_PREFIX = 'pci_databases_general_information';

export default {
  WARNING_MESSAGES,
  KARAPACE_URL,
  NEW_SUPPORT_TICKET_PARAMS,
  TRANSLATION_PREFIX,
};
