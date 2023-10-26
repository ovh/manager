export default class OctaviaLoadBalancerOverviewService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getFlavor(projectId, region, flavorId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${region}/loadbalancing/flavor/${flavorId}`,
      )
      .then(({ data }) => data);
  }

  getPrivateNetwork(projectId, region, networkId) {
    return this.$http
      .get(`/cloud/project/${projectId}/region/${region}/network/${networkId}`)
      .then(({ data }) => data);
  }

  getSubnet(projectId, region, networkId, subnetId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${region}/network/${networkId}/subnet/${subnetId}`,
      )
      .then(({ data }) => data);
  }
}
