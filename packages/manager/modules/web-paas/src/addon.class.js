import get from 'lodash/get';
import { ADDON_FAMILY } from './web-paas.constants';

export default class Addon {
  constructor({
    environmentServiceName,
    exclusive,
    family,
    mandatory,
    planCode,
    prices,
    productName,
    productType,
    serviceName,
    presentQuantity,
  }) {
    Object.assign(this, {
      environmentServiceName,
      exclusive,
      family,
      mandatory,
      planCode,
      prices,
      productName,
      productType,
      serviceName,
      presentQuantity,
    });
  }

  getRenewablePrice() {
    return get(this, 'prices').find(
      (price) => price.capacities.includes('renew') && price.priceInUcents > 0,
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
