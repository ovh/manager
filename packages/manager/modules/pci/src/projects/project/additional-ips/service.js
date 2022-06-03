export default class AdditionalIpService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getRegions(projectId, ovhSubsidiary) {
    const product = 'floatingip';
    return this.$http
      .get(`/cloud/project/${projectId}/capabilities/productAvailability`, {
        params: { product, ovhSubsidiary },
      })
      .then(({ data }) =>
        data.products
          .find(({ name }) => name === product)
          ?.regions.map(({ name, enabled }) => ({
            name,
            enabled,
            hasEnoughQuota: () => true,
          })),
      );
  }

  getNetworkSubnets(projectId, networkId) {
    return this.$http
      .get(`/cloud/project/${projectId}/network/private/${networkId}/subnet`)
      .then(({ data }) => data);
  }

  // TODO use gateway service when available
  getGateways(projectId, regionName) {
    return this.$http
      .get(`/cloud/project/${projectId}/region/${regionName}/gateway`)
      .then(({ data }) => data);
  }

  getPublicCloudCatalog(params) {
    return this.$http
      .get(`/order/catalog/public/cloud`, {
        params,
      })
      .then(({ data }) => data);
  }

  createFloatingIp(projectId, regionName, instanceId, networkIp) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/region/${regionName}/instance/${instanceId}/floatingip`,
        {
          ip: networkIp,
        },
      )
      .then(({ data }) => data);
  }
}
