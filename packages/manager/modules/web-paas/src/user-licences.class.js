export default class UserLicences {
  constructor({ accountName, customerId, customerType, createdAt }) {
    Object.assign(this, {
      accountName,
      customerId,
      customerType,
      createdAt,
    });
  }

  getMockData() {
    return [
      {
        accountName: 'pp668592-ovh',
        customerId: '7f025ead-69cf-4c13-b3df-4faa6c5d615a',
        customerType: 'OWNER',
        createdAt: '2020-12-09T07:44:33Z',
      },
      {
        accountName: 'uu668591-ovh',
        customerId: '4f025ead-69cf-4c13-b3df-4faa6c5d620',
        customerType: 'USER',
        createdAt: '2020-12-09T07:44:33Z',
      },
    ];
  }
}
