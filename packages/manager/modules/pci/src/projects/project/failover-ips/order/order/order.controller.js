import JSURL from 'jsurl';
import filter from 'lodash/filter';
import find from 'lodash/find';
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

    const [product] = this.products;
    const configurations = get(product, 'details.product.configurations');

    this.REGIONS = get(find(configurations, { name: 'country' }), 'values');
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

  onProductChange(product) {
    const configurations = get(product, 'details.product.configurations');
    this.REGIONS = get(find(configurations, { name: 'country' }), 'values');
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
    );
    this.goBack();
  }
}
