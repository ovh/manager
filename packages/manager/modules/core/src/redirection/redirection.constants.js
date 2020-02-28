const managerRoot = {
  EU: 'https://www.ovh.com',
  CA: 'https://ca.ovh.com',
  US: 'https://us.ovhcloud.com',
};

const guidesRoot = 'https://docs.ovh.com';

const URI = {
  autorenew: '#/billing/autorenew',
  billing: '#/billing/history',
  contacts: '#/contacts/services',
  orders: '#/billing/orders',
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
    guides: {
      home: {
        CZ: `${guidesRoot}/cz/cs/`,
        DE: `${guidesRoot}/de/`,
        ES: `${guidesRoot}/es/`,
        FI: `${guidesRoot}/fi/`,
        FR: `${guidesRoot}/fr/`,
        GB: `${guidesRoot}/gb/en/`,
        IE: `${guidesRoot}/ie/en/`,
        IT: `${guidesRoot}/it/`,
        LT: `${guidesRoot}/lt/`,
        MA: `${guidesRoot}/gb/en/`,
        NL: `${guidesRoot}/nl/`,
        PL: `${guidesRoot}/pl/`,
        PT: `${guidesRoot}/pt/`,
        SN: `${guidesRoot}/gb/en/`,
        TN: `${guidesRoot}/gb/en/`,
      },
    },
    help: 'https://help.ovhcloud.com',
    orders: `${managerRoot.EU}/manager/dedicated/${URI.orders}`,
    paymentMethod: `${managerRoot.EU}/manager/dedicated/${URI.paymentMethod}`,
    services: `${managerRoot.EU}/manager/dedicated/${URI.services}`,
    support: `${managerRoot.EU}/manager/dedicated/${URI.support}`,
    supportLevel: `${managerRoot.EU}/manager/dedicated/${URI.supportLevel}`,
    tasks: 'http://travaux.ovh.net/',
    ticket: `${managerRoot.EU}/manager/dedicated/#/support/tickets/:ticketId`,
    userEmails: `${managerRoot.EU}/manager/dedicated/${URI.userEmails}`,
  },
  CA: {
    autorenew: `${managerRoot.CA}/manager/dedicated/${URI.autorenew}`,
    billing: `${managerRoot.CA}/manager/${URI.billing}`,
    contacts: '',
    guides: {
      home: {
        ASIA: `${guidesRoot}/ca/en/`,
        AU: `${guidesRoot}/ca/en/`,
        CA: `${guidesRoot}/ca/en/`,
        QC: `${guidesRoot}/ca/fr/`,
        SG: `${guidesRoot}/ca/en/`,
        WE: `${guidesRoot}/ca/en/`,
        WS: `${guidesRoot}/ca/en/`,
      },
    },
    help: 'https://help.ovhcloud.com',
    orders: `${managerRoot.CA}/manager/${URI.orders}`,
    paymentMethod: `${managerRoot.CA}/manager/${URI.paymentMethod}`,
    services: `${managerRoot.CA}/manager/${URI.services}`,
    support: `${managerRoot.CA}/manager/${URI.support}`,
    supportLevel: `${managerRoot.CA}/manager/${URI.supportLevel}`,
    tasks: '',
    ticket: `${managerRoot.EU}/dedicated/#/support/tickets/:ticketId`,
    userEmails: `${managerRoot.CA}/manager/${URI.userEmails}`,
  },
  US: {
    billing: `${managerRoot.US}/manager/dedicated/${URI.billing}`,
    contacts: '',
    guides: {
      home: {
        US: 'https://support.us.ovhcloud.com',
      },
    },
    help: 'https://help.ovhcloud.com',
    paymentMethod: `${managerRoot.US}/manager/dedicated/${URI.paymentMethod}`,
    services: `${managerRoot.US}/manager/dedicated/${URI.services}`,
    support: `${managerRoot.US}/manager/dedicated/${URI.support}`,
    supportLevel: '',
    tasks: '',
    ticket: `${managerRoot.US}/manager/dedicated/#/ticket/:ticketId`,
    userEmails: `${managerRoot.US}/manager/dedicated/${URI.userEmails}`,
  },
};
