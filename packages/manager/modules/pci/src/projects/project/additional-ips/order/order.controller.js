import JSURL from 'jsurl';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import min from 'lodash/min';
import map from 'lodash/map';
import {
  ORDER_URL,
  IP_TYPE_ENUM,
  REGIONS,
  GUIDE_URLS,
} from './order.constants';

export default class AdditionalIpController {
  /* @ngInject */
  constructor(
    $window,
    $translate,
    coreConfig,
    OvhApiOrderCloudProjectIp,
    OvhApiOrderCatalogFormatted,
    additionalIpService,
  ) {
    this.$window = $window;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.OvhApiOrderCloudProjectIp = OvhApiOrderCloudProjectIp;
    this.OvhApiOrderCatalogFormatted = OvhApiOrderCatalogFormatted;
    this.additionalIpService = additionalIpService;
    this.IP_TYPE_ENUM = IP_TYPE_ENUM;
  }

  $onInit() {
    this.allInstances = this.instances;
    this.filteredInstances = [];
    this.privateNetworks = [];
    this.gateways = [];
    this.initIp();
    this.ip = {
      quantity: 1,
      instance: null,
      region: null,
      product: null,
    };
  }

  static getMaximumQuantity(product) {
    const configuration = get(product, 'details.product.default');
    const productWithMaxQuantity = filter(
      configuration,
      (p) => isNumber(p),
      'maximumQuantity',
    );
    return get(
      min(productWithMaxQuantity, 'maximumQuantity'),
      'maximumQuantity',
    );
  }

  order() {
    const order = {
      planCode: this.ip.product.planCode,
      productId: 'ip',
      pricingMode: 'default',
      quantity: this.ip.quantity,
      configuration: [
        {
          label: 'country',
          value: this.ip.region,
        },
        {
          label: 'destination',
          value: this.projectId,
        },
        {
          label: 'nexthop',
          value: this.ip.instance.id,
        },
      ],
    };
    this.$window.open(
      `${get(ORDER_URL, this.coreConfig.getRegion())}${JSURL.stringify([
        order,
      ])}`,
      '_blank',
      'noopener',
    );
    this.goBack();
  }

  onProductChange(ipType) {
    if (ipType.name === IP_TYPE_ENUM.FAILOVER && !this.failOverIpCountries) {
      this.initCountries();
    } else if (ipType.name === IP_TYPE_ENUM.FLOATING && !this.regions) {
      this.initRegions();
    }
  }

  onRegionChange(region) {
    if (this.selectedIpType.name === IP_TYPE_ENUM.FLOATING) {
      this.filterInstances(region.name);
    }
  }

  instanceChange(instance) {
    this.privateNetworks = filter(
      instance.ipAddresses,
      (network) => network.type === 'private',
    );
    if (this.privateNetworks.length === 1) {
      [this.ip.network] = this.privateNetworks;
    }
  }

  createAdditionalIp() {
    if (
      this.selectedIpType.name === IP_TYPE_ENUM.FAILOVER &&
      this.ip.instance
    ) {
      this.order();
    }
  }

  filterInstances(regionName) {
    this.filteredInstances = filter(this.instances, (instance) => {
      return (
        instance.region === regionName &&
        find(instance.ipAddresses, (ip) => ip.type === 'private')
      );
    });
  }

  initIp() {
    this.ipTypes = map(IP_TYPE_ENUM, (type) => {
      return {
        name: type,
        label: this.$translate.instant(`pci_additional_ip_${type}`),
        description: this.$translate.instant(
          `pci_additional_ip_${type}_description`,
        ),
      };
    });
    [this.selectedIpType] = this.ipTypes;
    this.initCountries();
  }

  initCountries() {
    this.loadProducts().then((products) => {
      const [product] = products;
      this.ip.product = product;
      const configurations = get(product, 'details.product.configurations');
      this.failOverIpCountries = get(
        find(configurations, { name: 'country' }),
        'values',
      );
    });
  }

  loadProducts() {
    this.loadingRegions = true;
    return this.OvhApiOrderCatalogFormatted.v6()
      .get({
        catalogName: 'ip',
        ovhSubsidiary: this.coreConfig.getUser().ovhSubsidiary,
      })
      .$promise.then(({ plans }) =>
        filter(
          plans,
          (offer) =>
            /failover/.test(offer.planCode) &&
            offer.invoiceName.includes(
              get(REGIONS, this.coreConfig.getRegion()),
            ),
        ),
      )
      .finally(() => {
        this.loadingRegions = false;
      });
  }

  initRegions() {
    this.loadingRegions = true;
    this.additionalIpService
      .getRegions(this.projectId, this.coreConfig.getUser().ovhSubsidiary)
      .then((regions) => {
        this.regions = regions;
      })
      .finally(() => {
        this.loadingRegions = false;
      });
  }

  loadGatewayDetails() {
    this.loadingGatewayDetails = true;
    this.additionalIpService
      .getGateways(this.projectId, this.ip.region.name)
      .then((gateways) => {
        this.gateways = gateways;
      })
      .finally(() => {
        this.loadingGatewayDetails = false;
      });
  }

  getAdditionalIpGuideLink() {
    return (
      GUIDE_URLS.FAILOVER_IP[this.coreConfig.getUser().ovhSubsidiary] ||
      GUIDE_URLS.FAILOVER_IP.DEFAULT
    );
  }

  getAdditionalIpConfGuideLink() {
    return (
      GUIDE_URLS.CONF_FAILOVER_IP[this.coreConfig.getUser().ovhSubsidiary] ||
      GUIDE_URLS.CONF_FAILOVER_IP.DEFAULT
    );
  }

  getRegionsAvailabilityGuideLink() {
    return (
      GUIDE_URLS.REGIONS_AVAILABILITY[
        this.coreConfig.getUser().ovhSubsidiary
      ] || GUIDE_URLS.REGIONS_AVAILABILITY.DEFAULT
    );
  }
}
