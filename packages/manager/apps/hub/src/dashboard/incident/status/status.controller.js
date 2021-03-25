import { Environment } from '@ovh-ux/manager-config';
import { DATACENTERS, FAQ, REGIONS } from './status.constants';

export default class StatusController {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.filtersOptions = {
      status: {
        hideOperators: true,
        values: this.translatedStatusEnum,
      },
      products: {
        hideOperators: true,
        values: this.translatedServiceEnum,
      },
      datacenters: {
        hideOperators: true,
        values: DATACENTERS,
      },
      regions: {
        hideOperators: true,
        values: REGIONS,
      },
    };

    this.faqLink = FAQ[Environment.getUserLocale()] || FAQ.en_GB;

    this.datagridParameters = [
      {
        name: 'region',
        hidden:
          this.services.length > 0 &&
          !Object.keys(this.services[0]).includes('region'),
      },
      {
        name: 'datacenter',
        hidden:
          this.services.length > 0 &&
          !Object.keys(this.services[0]).includes('datacenter'),
      },
      {
        name: 'rack',
        hidden:
          this.services.length > 0 &&
          !Object.keys(this.services[0]).includes('rack'),
      },
    ];
  }

  static hasInstances(service) {
    return service.productType === 'CLOUD_PROJECT';
  }

  static canBeResiliated(service) {
    return (
      !!service.serviceId &&
      ['NON_RECOVERABLE', 'TO_ASSESS'].includes(service.status) &&
      service.productType !== 'VPS'
    );
  }
}
