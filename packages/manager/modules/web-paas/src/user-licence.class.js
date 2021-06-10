export default class UserLicence {
  constructor({ accountName, customerId, customerType, createdAt }) {
    Object.assign(this, {
      accountName,
      customerId,
      customerType,
      createdAt,
    });
  }

  isOwner() {
    return this.customerType === 'OWNER';
  }
}
