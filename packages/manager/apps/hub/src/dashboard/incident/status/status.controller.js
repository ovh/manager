import { DATACENTERS, FAQ, REGIONS } from './status.constants';

export default class StatusController {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
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

    this.faqLink = FAQ[this.coreConfig.getUserLocale()] || FAQ.en_GB;

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
}
