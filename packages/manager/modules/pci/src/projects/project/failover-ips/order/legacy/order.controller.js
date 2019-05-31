import get from 'lodash/get';
import find from 'lodash/find';

import { INVALID_COUNTRY_ERROR, REGIONS } from './order.constants';

export default class FailoverIpController {
  /* @ngInject */
  constructor(
    $translate,
    $window,
    OvhApiOrderCloudProjectIp,
  ) {
    this.$translate = $translate;
    this.$window = $window;
    this.OvhApiOrderCloudProjectIp = OvhApiOrderCloudProjectIp;
  }

  $onInit() {
    this.ip = {
      quantity: 1,
      instance: null,
      region: null,
    };
  }


  onInstanceChange(instance) {
    if (this.ip.region) {
      this.checkCompatibility(instance, this.ip.region);
    }

    const continent = find(this.regions, { name: instance.region }).continentCode;

    this.REGIONS = REGIONS[continent].map(region => ({
      id: region,
      name: this.$translate.instant(`pci_projects_project_failoverip_order_legacy_country_${region}`),
    }));
  }

  onRegionChange(region) {
    if (this.ip.instance) {
      this.checkCompatibility(this.ip.instance, region);
    }
  }

  checkCompatibility(instance, region) {
    this.isCompatibilityLoading = true;
    this.contracts = null;
    this.regionIsInvalid = false;
    return this.OvhApiOrderCloudProjectIp.v6()
      .get({
        serviceName: this.projectId,
        country: region.id.toLowerCase(),
        instanceId: instance.id,
        quantity: this.ip.quantity,
      }).$promise
      .then(({ contracts, prices }) => {
        this.contracts = contracts;
        this.prices = prices;
      })
      .catch((error) => {
        const message = get(error, 'data.message', '');
        if (error.status === 403 && message.includes(INVALID_COUNTRY_ERROR)) {
          this.regionIsInvalid = true;
        } else {
          this.goBack(
            this.$translate.instant('pci_projects_project_failoverip_order_legacy_check_error', { message }),
            'error',
          );
        }
      })
      .finally(() => {
        this.isCompatibilityLoading = false;
      });
  }

  order() {
    this.isGeneratingOrder = true;
    return this.OvhApiOrderCloudProjectIp.v6().buy({
      serviceName: this.projectId,
    },
    {
      country: this.ip.region.id.toLowerCase(),
      instanceId: this.ip.instance.id,
      quantity: this.ip.quantity,
    }).$promise
      .then(({ url }) => {
        this.$window.open(url, '_blank');
        this.goBack({
          textHtml: this.$translate.instant('pci_projects_project_failoverip_order_legacy_success', { url }),
        });
      })
      .catch((error) => {
        this.goBack(
          this.$translate.instant('pci_projects_project_failoverip_order_legacy_error', { message: get(error, 'data.message', '') }),
          'error',
        );
      });
  }
}
