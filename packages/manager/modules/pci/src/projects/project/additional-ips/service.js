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

  // TODO use gateway service when available
  getGateways(projectId, regionName) {
    return this.$http
      .get(`/cloud/project/${projectId}/region/${regionName}/gateway`)
      .then(({ data }) => data);
  }
}
