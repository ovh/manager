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

export default class FailoverIpController {
  /* @ngInject */
  constructor(
    $window,
    $translate,
    coreConfig,
    OvhApiOrderCloudProjectIp,
    OvhApiOrderCatalogFormatted,
  ) {
    this.$window = $window;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.OvhApiOrderCloudProjectIp = OvhApiOrderCloudProjectIp;
    this.OvhApiOrderCatalogFormatted = OvhApiOrderCatalogFormatted;
  }

  $onInit() {
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

  onProductChange(ipType) {
    if (ipType.name === IP_TYPE_ENUM.FAILOVER) {
      this.initRegions();
    }
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

  createAdditionalIp() {
    if (
      this.selectedIpType.name === IP_TYPE_ENUM.FAILOVER &&
      this.ip.instance
    ) {
      this.order();
    }
  }

  initIp() {
    this.ipTypes = map(IP_TYPE_ENUM, (type) => {
      return {
        name: type,
        label: this.$translate.instant(`pci_pci_additional_ip_${type}`),
        description: this.$translate.instant(
          `pci_pci_additional_ip_${type}_description`,
        ),
      };
    });
    [this.selectedIpType] = this.ipTypes;
    this.initRegions();
  }

  initRegions() {
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

  getFailoverIpGuideLink() {
    return (
      GUIDE_URLS.FAILOVER_IP[this.coreConfig.getUser().ovhSubsidiary] ||
      GUIDE_URLS.FAILOVER_IP.DEFAULT
    );
  }

  getFailoverIpConfGuideLink() {
    return (
      GUIDE_URLS.CONF_FAILOVER_IP[this.coreConfig.getUser().ovhSubsidiary] ||
      GUIDE_URLS.CONF_FAILOVER_IP.DEFAULT
    );
  }
}
