const managerRoot = {
  EU: 'https://www.ovh.com',
  CA: 'https://ca.ovh.com',
  US: 'https://us.ovhcloud.com',
};

const URI = {
  autorenew: '#/billing/autorenew',
  billing: '#/billing/history',
  contacts: '#/contacts/services',
  paymentMethod: '#/billing/payment/method',
  services: '#/billing/autoRenew',
  support: '#/ticket',
  supportLevel: '#/useraccount/support/level',
  userEmails: '#/useraccount/emails',
};

export default {
  EU: {
    autorenew: `${managerRoot.EU}/manager/dedicated/${URI.autorenew}`,
    billing: `${managerRoot.EU}/manager/dedicated/${URI.billing}`,
    contacts: `${managerRoot.EU}/manager/dedicated/${URI.contacts}`,
    help: 'https://help.ovhcloud.com',
    paymentMethod: `${managerRoot.EU}/manager/dedicated/${URI.paymentMethod}`,
    services: `${managerRoot.EU}/manager/dedicated/${URI.services}`,
    support: `${managerRoot.EU}/manager/dedicated/${URI.support}`,
    supportLevel: `${managerRoot.EU}/manager/dedicated/${URI.supportLevel}`,
    tasks: 'http://travaux.ovh.net/',
    userEmails: `${managerRoot.EU}/manager/dedicated/${URI.userEmails}`,
  },
  CA: {
    autorenew: `${managerRoot.CA}/manager/dedicated/${URI.autorenew}`,
    billing: `${managerRoot.CA}/manager/${URI.billing}`,
    contacts: '',
    help: 'https://help.ovhcloud.com',
    paymentMethod: `${managerRoot.CA}/manager/${URI.paymentMethod}`,
    services: `${managerRoot.CA}/manager/${URI.services}`,
    support: `${managerRoot.CA}/manager/${URI.support}`,
    supportLevel: `${managerRoot.CA}/manager/${URI.supportLevel}`,
    tasks: '',
    userEmails: `${managerRoot.CA}/manager/${URI.userEmails}`,
  },
  US: {
    billing: `${managerRoot.US}/manager/dedicated/${URI.billing}`,
    contacts: '',
    help: 'https://help.ovhcloud.com',
    paymentMethod: `${managerRoot.US}/manager/dedicated/${URI.paymentMethod}`,
    services: `${managerRoot.US}/manager/dedicated/${URI.services}`,
    support: `${managerRoot.US}/manager/dedicated/${URI.support}`,
    supportLevel: '',
    tasks: '',
    userEmails: `${managerRoot.US}/manager/dedicated/${URI.userEmails}`,
  },
};
