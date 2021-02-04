import get from 'lodash/get';
import find from 'lodash/find';
import { STATUS } from './web-paas.constants';

export default class Plan {
  constructor({
    addonFamilies,
    blobs,
    configurations,
    family,
    invoiceName,
    planCode,
    pricingType,
    pricings,
    product,
    vcpus,
  }) {
    Object.assign(this, {
      addonFamilies,
      blobs,
      configurations,
      family,
      invoiceName,
      planCode,
      pricingType,
      pricings,
      product,
      vcpus,
    });
  }

  getCpu() {
    return [get(this, 'blobs.technical.cpu.cores')];
  }

  getStorage() {
    return get(this, 'blobs.technical.storage.disks[0].capacity');
  }

  getTestEnvironment() {
    return find(get(this, 'blobs.commercial.features'), {
      name: 'staging_environment_included',
    }).value;
  }

  getProdEnvironment() {
    return find(get(this, 'blobs.commercial.features'), {
      name: 'production_environment_included',
    }).value;
  }

  getMaxLicenses() {
    return find(get(this, 'blobs.commercial.features'), {
      name: 'max_user_licences',
    }).value;
  }

  isActive() {
    return this.status === STATUS.ACTIVE;
  }

  isError() {
    return this.status === STATUS.ERROR;
  }

  isProcessing() {
    return [STATUS.PENDING, STATUS.CANCELLING].includes(this.status);
  }
}
