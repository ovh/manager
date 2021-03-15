import { Environment } from '@ovh-ux/manager-config';
import { DATACENTERS, FAQ, REGIONS } from './status.constants';

export default class StatusController {
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
    ];
  }
}
