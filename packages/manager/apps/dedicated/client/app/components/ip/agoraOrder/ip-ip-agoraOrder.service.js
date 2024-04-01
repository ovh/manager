import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

export default class IpAgoraOrder {
  /* @ngInject */
  constructor($q, $http, OvhHttp) {
    this.$q = $q;
    this.$http = $http;
    this.OvhHttp = OvhHttp;

    this.fetchPricesTries = 0;
  }

  getIpCatalog(ovhSubsidiary = 'FR') {
    return this.$http
      .get(`/order/catalog/formatted/ip?ovhSubsidiary=${ovhSubsidiary}`)
      .then(({ data: { plans } }) => {
        return plans;
      })
      .catch(() => null);
  }

  handleErrorOrServices({ errors, results }) {
    const filteredErrors = errors.filter(({ msg }) => {
      const [errorCode] = msg.match(/\d+/);
      return ![400, 404].includes(parseInt(errorCode, 10));
    });
    if (isArray(filteredErrors) && !isEmpty(filteredErrors)) {
      return this.$q.reject(filteredErrors);
    }

    return get(results, '[0].services', []);
  }

  static createProductToOrder({
    configuration = [],
    country,
    description,
    destination,
    duration = 'P1M',
    regionId,
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

    if (regionId) {
      productToOrder.configuration.push({
        label: 'ip_region',
        value: regionId,
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
