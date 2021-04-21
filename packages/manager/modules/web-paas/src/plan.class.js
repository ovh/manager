import { find, get } from 'lodash';
import {
  ENVIRONMENT_VALUES,
  LICENCES_VALUES,
  STORAGE_VALUES,
  PLAN_CODE,
} from './web-paas.constants';

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
    totalPrice,
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
      totalPrice,
    });
    this.ENVIRONMENT_VALUES = ENVIRONMENT_VALUES;
    this.LICENCES_VALUES = LICENCES_VALUES;
    this.STORAGE_VALUES = STORAGE_VALUES;
    this.PLAN_CODE = PLAN_CODE;
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
    return parseInt(
      find(get(this, 'blobs.commercial.features'), {
        name: 'user_licences_included',
      }).value,
      10,
    );
  }

  getRenewablePrice() {
    return get(this, 'pricings').find(({ capacities }) =>
      capacities.includes('renew'),
    ).price;
  }

  getMaxEnvironment() {
    return this.ENVIRONMENT_VALUES.MAX;
  }

  getMaxStorage() {
    return this.product === this.PLAN_CODE.EXPAND
      ? this.STORAGE_VALUES.MAX_FOR_EXPAND_PLAN
      : this.STORAGE_VALUES.MAX_FOR_OTHER_PLANS;
  }

  getMaxLicenses() {
    return parseInt(
      this.product === this.PLAN_CODE.EXPAND
        ? this.LICENCES_VALUES.MAX
        : find(get(this, 'blobs.commercial.features'), {
            name: 'max_user_licences',
          })?.value,
      10,
    );
  }

  getRange() {
    return get(this, 'blobs.commercial.range');
  }

  isContainerRestricted() {
    return (
      find(get(this, 'blobs.commercial.features'), {
        name: 'container_restrictions',
      }).value === 'Yes'
    );
  }

  allowsSingleApp() {
    return find(get(this, 'blobs.commercial.features'), {
      name: 'container_allowed_single_app',
    })?.value;
  }

  allowsSingleService() {
    return find(get(this, 'blobs.commercial.features'), {
      name: 'container_allowed_single_service',
    })?.value;
  }

  hasAutomatedBackup() {
    return find(get(this, 'blobs.commercial.features'), {
      name: 'automated_backup',
    })?.value;
  }

  sslCertificatesIncluded() {
    return find(get(this, 'blobs.commercial.features'), {
      name: 'ssl_certificate_included',
    })?.value;
  }
}
