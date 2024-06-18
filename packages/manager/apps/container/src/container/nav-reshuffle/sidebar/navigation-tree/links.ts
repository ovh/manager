const links = [
  {
    id: 'account',
    translation: 'sidebar_account',
    count: false,
    children: [
      {
        id: 'account_profile',
        translation: 'sidebar_account_profile',
        routing: {
          application: 'dedicated',
          hash: '#/useraccount',
        },
        count: false,
      },
      {
        id: 'account_identity_documents',
        translation: 'sidebar_account_identity_documents',
        routing: {
          application: 'dedicated',
          hash: '#/identity-documents',
        },
        count: false,
        features: ['additional-ips'],
      },
      {
        id: 'account_contacts',
        translation: 'sidebar_account_contacts',
        routing: {
          application: 'dedicated',
          hash: '#/contacts/services',
        },
        count: false,
        features: ['contact:management'],
      },
      {
        id: 'account_iam',
        translation: 'sidebar_account_iam',
        routing: {
          application: 'iam',
          hash: '#/',
        },
        count: false,
        features: ['iam'],
      },
      {
        id: 'carbon_consumption',
        translation: 'sidebar_carbon_footprint',
        routing: {
          application: 'carbon-calculator',
          hash: '#/',
        },
        count: false,
        features: ['carbon-calculator'],
        region: ['EU', 'CA'],
      },
      {
        id: 'billing_services',
        translation: 'sidebar_billing_ssh',
        routing: {
          application: 'dedicated',
          hash: '#/billing/autorenew',
        },
        idAttr: 'sidebar-link-services',
        count: false,
        region: ['US'],
      },
    ],
  },
  {
    id: 'billing',
    translation: 'sidebar_billing',
    count: false,
    idAttr: 'sidebar-link-billing',
    children: [
      {
        id: 'billing_services',
        translation: 'sidebar_billing_services',
        routing: {
          application: 'dedicated',
          hash: '#/billing/autorenew',
        },
        idAttr: 'sidebar-link-services',
        count: false,
        region: ['EU', 'CA'],
      },
      {
        id: 'billing_bills',
        translation: 'sidebar_billing_bills',
        routing: {
          application: 'dedicated',
          hash: '#/billing/history',
        },
        count: false,
      },
      {
        id: 'billing_payment',
        translation: 'sidebar_billing_payment',
        routing: {
          application: 'dedicated',
          hash: '#/billing/payment/method',
        },
        count: false,
      },
    ],
  },
  {
    id: 'orders',
    translation: 'sidebar_orders',
    routing: {
      application: 'dedicated',
      hash: '#/billing/orders',
    },
    count: false,
  },
];

export default links;
