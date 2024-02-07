import filter from 'lodash/filter';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

import {
  FETCH_PRICE_MAX_TRIES,
  PRODUCT_TYPES,
  IP_FAILOVER_PLANCODE,
} from './ip-ip-agoraOrder.constant';

export default class IpAgoraOrder {
  /* @ngInject */
  constructor($q, $http, OvhHttp) {
    this.$q = $q;
    this.$http = $http;
    this.OvhHttp = OvhHttp;

    this.fetchPricesTries = 0;
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

  fetchProducts(product) {
    return this.OvhHttp.get('/products', {
      rootPath: '2api',
      params: {
        product,
      },
    });
  }

  getServices() {
    return this.$q
      .all([
        this.fetchProducts(
          PRODUCT_TYPES.privateCloud.apiTypeName,
        ).then((privateClouds) => this.handleErrorOrServices(privateClouds)),
        this.fetchProducts(
          PRODUCT_TYPES.dedicatedServer.apiTypeName,
        ).then((dedicatedServers) =>
          this.handleErrorOrServices(dedicatedServers),
        ),
        this.fetchProducts(PRODUCT_TYPES.vps.apiTypeName).then((vps) =>
          this.handleErrorOrServices(vps),
        ),
      ])
      .then(([privateClouds, dedicatedServers, vps]) => [
        ...privateClouds.map((privateCloud) => ({
          ...privateCloud,
          type: PRODUCT_TYPES.privateCloud.typeName,
        })),
        ...dedicatedServers.map((dedicatedServer) => ({
          ...dedicatedServer,
          type: PRODUCT_TYPES.dedicatedServer.typeName,
        })),
        ...vps.map((vpsService) => ({
          ...vpsService,
          type: PRODUCT_TYPES.vps.typeName,
        })),
      ]);
  }

  getIpOffers(ovhSubsidiary = 'US', catalogName = 'ip') {
    return this.OvhHttp.get(`/order/catalog/formatted/${catalogName}`, {
      rootPath: 'apiv6',
      params: {
        ovhSubsidiary,
      },
    }).then(({ plans }) => plans);
  }

  getPrivateCloudIpOffers(serviceName) {
    return this.OvhHttp.get(
      `/order/cartServiceOption/privateCloud/${serviceName}`,
      {
        rootPath: 'apiv6',
      },
    ).then((ipOffers) =>
      filter(ipOffers, {
        family: 'ip',
      }),
    );
  }

  getDedicatedServerRegion(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}`)
      .then(({ data }) => data.region);
  }

  getDedicatedCloudServerRegion(serviceName) {
    return this.$http
      .get(`/dedicatedCloud/${serviceName}`)
      .then(({ data }) => data.location);
  }

  getVpsServerRegion(serviceName) {
    return this.$http
      .get(`/sws/vps/${serviceName}/info`, { serviceType: 'aapi' })
      .then(({ data }) => data.location?.datacentre);
  }

  checkIpDedicatedServerIsOrderable(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/orderable/ip`)
      .then(({ data: orderable }) => orderable.ipv4?.length > 0)
      .catch(() => false);
  }

  getIpFailoverPrice(ovhSubsidiary = 'FR', region = 'EU') {
    return this.$http
      .get(`/order/catalog/formatted/ip?ovhSubsidiary=${ovhSubsidiary}`)
      .then(({ data: { plans } }) => {
        const ipFailoverRIPEPlan = plans.find(
          ({ planCode }) => planCode === IP_FAILOVER_PLANCODE[region],
        );
        if (!ipFailoverRIPEPlan) {
          return null;
        }
        return ipFailoverRIPEPlan.details.pricings.default.find((price) =>
          ['renew', 'installation'].every((capacity) =>
            price.capacities.includes(capacity),
          ),
        );
      })
      .catch(() => null);
  }

  fetchPrices(serviceName, blockSize) {
    this.fetchPricesTries += 1;
    return this.OvhHttp.get(
      `/order/cartServiceOption/privateCloud/${serviceName}`,
      {
        rootPath: 'apiv6',
      },
    )
      .then((offers) => {
        this.fetchPricesTries = 0;
        const matchingOffers = offers
          .filter((offer) => offer.family === 'ip')
          .filter((offer) => offer.planCode.includes(blockSize));

        return [].concat(
          ...matchingOffers.map((offer) =>
            offer.prices.map((price) => ({
              planCode: offer.planCode,
              duration: price.duration,
              price: price.price.text,
            })),
          ),
        );
      })
      .catch((error) => this.retryFetchPrices(error, serviceName, blockSize));
  }

  retryFetchPrices(error, ...args) {
    if (this.fetchPricesTries === FETCH_PRICE_MAX_TRIES) {
      return this.$q.reject(error);
    }

    return this.fetchPrices(...args);
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

  getIpCountryAvailablePromise(serviceName, serviceType) {
    return this.OvhHttp.get(
      this.constructor.getIpCountryAvailableRoute(serviceName, serviceType),
      {
        rootPath: 'apiv6',
      },
    );
  }

  static getIpCountryAvailableRoute(serviceName, serviceType) {
    switch (serviceType) {
      case PRODUCT_TYPES.dedicatedServer.typeName:
        return `/dedicated/server/${serviceName}/ipCountryAvailable`;
      case PRODUCT_TYPES.privateCloud.typeName:
        return `/dedicatedCloud/${serviceName}/orderableIpCountries`;
      case PRODUCT_TYPES.vps.typeName:
        return `/vps/${serviceName}/ipCountryAvailable`;
      default:
        return null;
    }
  }

  getOrderableIpCountries(serviceName) {
    return this.$http
      .get(`/dedicatedCloud/${serviceName}/orderableIpCountries`)
      .then(({ data }) => data);
  }
}
