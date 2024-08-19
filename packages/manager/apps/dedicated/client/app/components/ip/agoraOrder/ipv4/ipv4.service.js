import filter from 'lodash/filter';

import { FETCH_PRICE_MAX_TRIES, PRODUCT_TYPES } from './ipv4.constant';

export default class Ipv4AgoraOrder {
  /* @ngInject */
  constructor($q, $http, OvhHttp, IpAgoraOrder, iceberg) {
    this.$q = $q;
    this.$http = $http;
    this.OvhHttp = OvhHttp;
    this.IpAgoraOrder = IpAgoraOrder;
    this.iceberg = iceberg;
    this.fetchPricesTries = 0;
  }

  fetchProducts(product) {
    return this.OvhHttp.get('/products', {
      rootPath: '2api',
      params: {
        product,
      },
    });
  }

  getVracks() {
    return this.iceberg('/vrack')
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) =>
        data.map((vrack) => {
          const serviceName = vrack.iam.urn.split(':').pop();
          const displayName = vrack.name || serviceName;
          return {
            displayName,
            serviceName,
            type: PRODUCT_TYPES.vrack.apiTypeName,
          };
        }),
      );
  }

  getServices() {
    return this.$q
      .all([
        this.fetchProducts(
          PRODUCT_TYPES.privateCloud.apiTypeName,
        ).then((privateClouds) =>
          this.IpAgoraOrder.handleErrorOrServices(privateClouds),
        ),
        this.fetchProducts(
          PRODUCT_TYPES.dedicatedServer.apiTypeName,
        ).then((dedicatedServers) =>
          this.IpAgoraOrder.handleErrorOrServices(dedicatedServers),
        ),
        this.fetchProducts(PRODUCT_TYPES.vps.apiTypeName).then((vps) =>
          this.IpAgoraOrder.handleErrorOrServices(vps),
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

  checkIpDedicatedServerIsOrderable(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/orderable/ip`)
      .then(({ data: orderable }) => orderable.ipv4?.length > 0)
      .catch(() => false);
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
