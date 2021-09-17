import Cluster from '../cluster.class';

export default class NutanixDashboardService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getCluster(serviceName) {
    return this.$http
      .get(`/nutanix/${serviceName}`)
      .then(({ data }) => new Cluster(data));
  }
}
