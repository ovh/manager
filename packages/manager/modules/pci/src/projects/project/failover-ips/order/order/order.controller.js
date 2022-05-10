import JSURL from 'jsurl';
import filter from 'lodash/filter';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import min from 'lodash/min';
import { ORDER_URL } from './order.constants';

export default class FailoverIpController {
  /* @ngInject */
  constructor($window, coreConfig, OvhApiOrderCloudProjectIp) {
    this.$window = $window;
    this.coreConfig = coreConfig;
    this.OvhApiOrderCloudProjectIp = OvhApiOrderCloudProjectIp;
  }

  $onInit() {
    this.ip = {
      quantity: 1,
      instance: null,
      region: null,
      product: null,
    };

    const configurations = this.products.flatMap(
      (product) => product?.details?.product?.configurations,
    );

    this.productsList = this.products.filter(
      (product, index, products) =>
        products.findIndex(
          (p) => p.details.product.name === product.details.product.name,
        ) === index,
    );

    this.REGIONS = configurations
      .filter(({ name }) => name === 'country')
      .flatMap(({ values }) => values)
      .sort();
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
      `${get(ORDER_URL, this.coreConfig.getRegion())}${JSURL.stringify([
        order,
      ])}`,
      '_blank',
    );
    this.goBack();
  }
}
