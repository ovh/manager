import { find, get } from 'lodash';

export default class Plan {
  /* @ngInject */
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
    vcpuConfig,
    available,
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
      vcpuConfig,
      available,
    });
  }

  getCpu() {
    return get(this, 'blobs.technical.cpu.cores');
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

  getLicences() {
    return find(get(this, 'blobs.commercial.features'), {
      name: 'user_licences_included',
    }).value;
  }

  getPrice() {
    return get(this, 'pricings').find(({ capacities }) =>
      capacities.includes('renew'),
    ).price;
  }

  getMaxEnvironment() {
    return this.product === 'expand' ? 50 : 10;
  }

  getMaxStorage() {
    return this.product === 'expand' ? 100 : 10;
  }

  getMaxLicenses() {
    return this.product === 'expand'
      ? 100
      : find(get(this, 'blobs.commercial.features'), {
          name: 'max_user_licences',
        })?.value;
  }
}
