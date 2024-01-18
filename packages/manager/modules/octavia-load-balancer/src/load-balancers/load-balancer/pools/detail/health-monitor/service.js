export default class OctaviaLoadBalancerHealthMonitorService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  // WORK IN PROGRESS
  // TODO: USE REAL API TO RETRIEVE THE POOL HEALTH MONITOR
  // TODO: REMOVE ESLINT-DISABLE
  /* eslint-disable class-methods-use-this */
  /* eslint-disable no-unused-vars */
  getHealthMonitor(projectId, region, poolId) {
    return [];
  }
}
