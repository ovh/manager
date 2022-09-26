export default class PciProjectAdditionalIpService {
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

  getPrivateNetworks(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/network/private`)
      .then(({ data }) => data);
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

  getGatewayDetails(projectId, region, gatewayId) {
    return this.$http
      .get(`/cloud/project/${projectId}/region/${region}/gateway/${gatewayId}`)
      .then(({ data }) => data);
  }

  enableSnatOnGateway(projectId, region, gatewayId) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/region/${region}/gateway/${gatewayId}/expose`,
      )
      .then(({ data }) => data);
  }

  getPublicCloudCatalog(params) {
    return this.$http
      .get(`/order/catalog/public/cloud`, {
        params,
      })
      .then(({ data }) => data);
  }

  createFloatingIp(projectId, regionName, instanceId, ip, gateway = null) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/region/${regionName}/instance/${instanceId}/floatingip`,
        {
          ip,
          ...(gateway && { gateway }),
        },
      )
      .then(({ data }) => data);
  }

  deleteIpBlock(ipBlock) {
    const [ip, block] = ipBlock.split('/');
    return this.$http.post(
      `/ip/service/${`ip-${block === '32' ? ip : ipBlock}`}/terminate`,
    );
  }

  updateInstanceForFloatingIp(projectId, region, instanceId, floatingIpId, ip) {
    return this.$http.post(
      `/cloud/project/${projectId}/region/${region}/instance/${instanceId}/associateFloatingIp`,
      {
        floatingIpId,
        ip,
      },
    );
  }
}
