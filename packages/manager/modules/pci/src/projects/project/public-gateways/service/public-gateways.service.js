import { GATEWAY_DEFAULT_REGION } from '../public-gateways.constants';

export default class publicGatewaysServiceClass {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getGatwayCatalog(params) {
    return this.$http
      .get(`/order/catalog/public/cloud`, {
        params,
      })
      .then(({ data }) => data);
  }

  getGateways(serviceName, regionName = GATEWAY_DEFAULT_REGION) {
    return this.$http
      .get(`/cloud/project/${serviceName}/region/${regionName}/gateway`)
      .then((gateways) =>
        gateways.data.map((gateway) => {
          return {
            ...gateway,
            region: regionName,
            formattedIps: gateway.externalInformation.ips
              .map(({ ip }) => ip)
              .join(', '),
          };
        }),
      );
  }

  addGateway(serviceName, region, gateway) {
    return this.$http
      .post(`/cloud/project/${serviceName}/region/${region}/gateway`, gateway)
      .then(({ data }) => data);
  }

  getPrivateNetworks(serviceName, regionName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/region/${regionName}/network`)
      .then(({ data }) => data);
  }

  getSubnet(serviceName, region, networkId) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/region/${region}/network/${networkId}/subnet`,
      )
      .then(({ data: subnet }) => subnet);
  }

  getSubnetById(serviceName, regionName, networkId, subnetId) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/region/${regionName}/network/${networkId}/subnet/${subnetId}`,
      )
      .then(({ data: subnet }) => subnet);
  }

  createNetworkWithGateway(serviceName, regionName, gateway) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${regionName}/network`,
        gateway,
      )
      .then(({ data }) => data);
  }

  getRegions(serviceName, params) {
    return this.$http
      .get(`/cloud/project/${serviceName}/capabilities/productAvailability`, {
        params,
      })
      .then(({ data }) => data);
  }

  deleteGateway(serviceName, regionName, gatewayId) {
    return this.$http
      .delete(
        `/cloud/project/${serviceName}/region/${regionName}/gateway/${gatewayId} `,
      )
      .then(({ data }) => data);
  }

  editGateway(serviceName, regionName, gatewayId, params) {
    return this.$http
      .put(
        `/cloud/project/${serviceName}/region/${regionName}/gateway/${gatewayId}`,
        params,
      )
      .then(({ data }) => data);
  }

  enableSnatOnGateway(projectId, region, gatewayId) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/region/${region}/gateway/${gatewayId}/expose`,
      )
      .then(({ data }) => data);
  }

  getSmallestGatewayInfo(ovhSubsidiary) {
    return this.getGatwayCatalog({
      ovhSubsidiary,
      productName: 'cloud',
    }).then((data) => {
      // pick the variants of product with least price
      const gatewayProducts = data.addons
        .filter((addon) => addon.product.startsWith('publiccloud-gateway'))
        .sort(
          (
            { pricings: [{ price: priceA }] },
            { pricings: [{ price: priceB }] },
          ) => priceA - priceB,
        )
        .filter(({ product }, index, arr) => product === arr[0].product);
      const [monthlyPriceObj] = gatewayProducts.find(({ planCode }) =>
        planCode.includes('month'),
      )?.pricings;
      const [hourlyPriceObj] = gatewayProducts.find(({ planCode }) =>
        planCode.includes('hour'),
      )?.pricings;
      return {
        size: gatewayProducts[0].product
          .split('-')
          .slice(-1)
          .join(),
        pricePerMonth: monthlyPriceObj.price,
        pricePerHour: hourlyPriceObj.price,
      };
    });
  }
}
