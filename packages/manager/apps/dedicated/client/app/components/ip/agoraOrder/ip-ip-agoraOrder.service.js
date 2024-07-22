export default class IpAgoraOrder {
  /* @ngInject */
  constructor($q, $http) {
    this.$q = $q;
    this.$http = $http;

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
    if (filteredErrors?.length) {
      return this.$q.reject(filteredErrors);
    }

    return results?.length ? results[0].services : [];
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
    datacenter,
  }) {
    const productToOrder = {
      configuration,
      duration,
      planCode,
      pricingMode,
      productId,
      quantity,
      serviceName,
      datacenter,
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

    if (datacenter) {
      productToOrder.configuration.push({
        label: 'datacenter',
        value: datacenter,
      });
    }

    return productToOrder;
  }
}
