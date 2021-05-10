import get from 'lodash/get';
import { ADDON_FAMILY } from './web-paas.constants';

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

  getRenewablePrice() {
    return get(this, 'prices').find(({ capacities }) =>
      capacities.includes('renew'),
    ).price;
  }

  isUserLicenseAddon() {
    return this.family === ADDON_FAMILY.LICENSE;
  }

  isStorageAddon() {
    return this.family === ADDON_FAMILY.STORAGE;
  }

  isStagingEnvironmentAddon() {
    return this.family === ADDON_FAMILY.ENVIRONMENT;
  }
}
