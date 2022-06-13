import { GATEWAY_DEFAULT_REGION } from './public-gateways.constants';

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

  addPrivateNetwork(serviceName, regionName, privateNetwork) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${regionName}/network`,
        privateNetwork,
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
}
