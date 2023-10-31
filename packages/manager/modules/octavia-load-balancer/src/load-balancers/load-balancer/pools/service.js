export default class OctaviaLoadBalancerPoolsService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getPools(projectId, region) {
    console.log('Project Id = ', projectId);
    console.log('Region = ', region);
    return this.$http
      .get(`/cloud/project/${projectId}/region/${region}/loadbalancing/pool`)
      .then(({ data }) => data);
  }
}
