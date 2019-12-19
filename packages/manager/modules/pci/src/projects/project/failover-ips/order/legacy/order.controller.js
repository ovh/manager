import get from 'lodash/get';
import find from 'lodash/find';

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
    const { ipCountries: countries } = find(this.regions, { name: instance.region });
    this.REGIONS = countries.map((region) => ({
      id: region,
      name: this.$translate.instant(`pci_projects_project_failoverip_order_legacy_country_${region.toUpperCase()}`),
    }));

    if (this.ip.region && countries.includes(this.ip.region.id)) {
      this.getContracts(instance, this.ip.region);
    } else {
      this.ip.region = null;
    }
  }

  onRegionChange(region) {
    if (this.ip.instance) {
      this.getContracts(this.ip.instance, region);
    }
  }

  getContracts(instance, region) {
    this.isContractLoading = true;
    this.contracts = null;
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
        this.goBack(
          this.$translate.instant('pci_projects_project_failoverip_order_legacy_check_error', { message: get(error, 'data.message', '') }),
          'error',
        );
      })
      .finally(() => {
        this.isContractLoading = false;
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
