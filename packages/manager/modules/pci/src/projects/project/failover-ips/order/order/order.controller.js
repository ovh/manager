import JSURL from 'jsurl';
import filter from 'lodash/filter';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import min from 'lodash/min';

export default class FailoverIpController {
  /* @ngInject */
  constructor(
    $window,
    coreConfig,
    OvhApiOrderCloudProjectIp,
    RedirectionService,
  ) {
    this.$window = $window;
    this.coreConfig = coreConfig;
    this.expressOrderUrl = RedirectionService.getURL('expressOrder');
    this.OvhApiOrderCloudProjectIp = OvhApiOrderCloudProjectIp;
  }

  $onInit() {
    this.orderRegion = null;
    this.ip = {
      quantity: 1,
      instance: null,
      region: null,
      product: null,
    };

    this.productsList = this.products.filter(
      (product, index, products) =>
        products.findIndex(
          (p) => p.details.product.name === product.details.product.name,
        ) === index,
    );
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

  onInstanceSelect(instance) {
    this.ip.region = null;
    this.orderRegion = this.availableRegionsForOrder.find(
      (region) => region.name === instance.region,
    );

    this.REGIONS = this.products
      .flatMap((product) => product?.details?.product?.configurations)
      .filter(({ name }) => name === 'country')
      .flatMap(({ values }) => values)
      .filter((country) =>
        this.orderRegion.ipCountries.some(
          (ipCountry) => country === ipCountry.toUpperCase(),
        ),
      )
      .sort();
  }

  order() {
    const planCode = this.products.find((product) =>
      product.details.product.configurations
        .filter(({ name }) => name === 'country')
        .flatMap(({ values }) => values)
        .includes(this.ip.region),
    )?.planCode;

    const order = {
      planCode,
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
      `${this.expressOrderUrl}?products=${JSURL.stringify([order])}`,
      '_blank',
      'noopener',
    );

    this.goBack();
  }
}
