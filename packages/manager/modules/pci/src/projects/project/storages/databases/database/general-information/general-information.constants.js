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

export default {
  WARNING_MESSAGES,
  KARAPACE_URL,
};
