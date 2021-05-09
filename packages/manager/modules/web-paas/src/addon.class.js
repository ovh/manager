import get from 'lodash/get';

export default class Addon {
  constructor({
    exclusive,
    family,
    mandatory,
    planCode,
    prices,
    productName,
    productType,
  }) {
    Object.assign(this, {
      exclusive,
      family,
      mandatory,
      planCode,
      prices,
      productName,
      productType,
    });
  }

  getPrice() {
    return get(this, 'prices').find(({ capacities }) =>
      capacities.includes('renew'),
    ).price;
  }

  isUserLicenseAddon() {
    return this.family === 'user_license';
  }

  isStorageAddon() {
    return this.family === 'storage';
  }

  isStagingEnvironmentAddon() {
    return this.family === 'staging_environment';
  }
}
