import get from 'lodash/get';
import find from 'lodash/find';

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
}
