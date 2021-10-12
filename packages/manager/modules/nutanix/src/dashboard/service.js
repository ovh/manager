import { BillingService } from '@ovh-ux/manager-models';
import Cluster from '../cluster.class';

export default class NutanixService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getCluster(serviceName) {
    return this.$http
      .get(`/nutanix/${serviceName}`)
      .then(({ data }) => new Cluster(data));
  }

  getServiceInfo(serviceName) {
    return this.$http
      .get(`/nutanix/${serviceName}/serviceInfos`)
      .then(({ data }) => new BillingService(data));
  }

  getNodeHardwareInfo(nodeId) {
    return this.$http
      .get(`/dedicated/technical-details/${nodeId}`, {
        serviceType: 'aapi',
      })
      .then(({ data }) =>
        data?.baremetalServers?.storage ? data?.baremetalServers : null,
      )
      .catch(() => null);
  }
}
