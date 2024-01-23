export default class OctaviaLoadBalancerService {
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

  getLoadbalancer(projectId, region, loadbalancerId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${region}/loadbalancing/loadbalancer/${loadbalancerId}`,
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

  updateName(projectId, region, loadbalancerId, name) {
    return this.$http.put(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/loadbalancer/${loadbalancerId}`,
      {
        name,
      },
    );
  }

  deleteLoadBalancer(projectId, loadBalancerRegion, loadBalancerId) {
    return this.$http.delete(
      `/cloud/project/${projectId}/region/${loadBalancerRegion}/loadbalancing/loadbalancer/${loadBalancerId}`,
    );
  }

  getAPISpecifications() {
    return this.$http.get(`/cloud.json`).then(({ data }) => data);
  }
}
