export const catalogDedicatedServerList = [
  'dedicated-server-123',
  'dedicated-server-456',
  'dedicated-server-789',
];

export const availableOperations = [
  'failoverIP',
  'kvm',
  'ip',
  'bandwidth',
  'backupStorage',
  'ipMigration',
  'supportLevel',
];

export const availableDurations = ['upto-2026-12-31'];

export const ipMigrationOrderRecap = {
  prices: {
    withTax: { value: 2, currencyCode: 'EUR', text: '2.00 €' },
    tax: { value: 0, text: '0.00 €', currencyCode: 'EUR' },
    withoutTax: { text: '2.00 €', currencyCode: 'EUR', value: 2 },
  },
  contracts: [
    {
      content: '',
      name: 'Data_Protection_Agreement',
      url: 'https://example.com',
    },
  ],
  details: [
    {
      totalPrice: { value: 0, text: '0.00 €', currencyCode: 'EUR' },
      description: "Migration d'une IP de So you Start vers OVH",
      detailType: 'INSTALLATION',
      domain: 'domain1',
      unitPrice: { text: '0.00 €', currencyCode: 'EUR', value: 0 },
      quantity: 1,
    },
    {
      unitPrice: { currencyCode: 'EUR', text: '0.00 €', value: 0 },
      quantity: 1,
      domain: 'domain2',
      detailType: 'DURATION',
      totalPrice: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
      description: "Mise à disposition d'une IP failover - 1 mois",
    },
    {
      detailType: 'INSTALLATION',
      totalPrice: { value: 2, currencyCode: 'EUR', text: '2.00 €' },
      description: "Frais d'installation d'une IP ou d'un bloc d'IP",
      domain: 'domain3',
      unitPrice: { value: 2, text: '2.00 €', currencyCode: 'EUR' },
      quantity: 1,
    },
    {
      quantity: 1,
      unitPrice: { text: '0.00 €', currencyCode: 'EUR', value: 0 },
      domain: 'domain4',
      description: "Allocation et mise en place de l'IP",
      totalPrice: { currencyCode: 'EUR', text: '0.00 €', value: 0 },
      detailType: 'INSTALLATION',
    },
  ],
};

export const ipMigrationPostResponse = {
  orderId: 123456789,
  url: 'https://www.ovh.com/express-order',
  ...ipMigrationOrderRecap,
};
