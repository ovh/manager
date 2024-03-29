export default class IpAgoraOrder {
  /* @ngInject */
  constructor($q, $http, OvhHttp) {
    this.$q = $q;
    this.$http = $http;
    this.OvhHttp = OvhHttp;

    this.fetchPricesTries = 0;
  }

  static createProductToOrder({
    configuration = [],
    country,
    description,
    destination,
    duration = 'P1M',
    organisation,
    netname,
    planCode,
    productId = 'ip',
    pricingMode = 'default',
    quantity = 1,
    serviceName,
  }) {
    const productToOrder = {
      configuration,
      duration,
      planCode,
      pricingMode,
      productId,
      quantity,
      serviceName,
    };

    if (description) {
      productToOrder.configuration.push({
        label: 'description',
        value: description,
      });
    }

    if (netname) {
      productToOrder.configuration.push({
        label: 'netname',
        value: netname,
      });
    }

    if (destination) {
      productToOrder.configuration.push({
        label: 'destination',
        value: destination,
      });
    }

    if (country) {
      productToOrder.configuration.push({
        label: 'country',
        value: country,
      });
    }

    if (organisation) {
      productToOrder.configuration.push({
        label: 'organisation',
        value: organisation,
      });
    }

    return productToOrder;
  }
}
