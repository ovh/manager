import { DedicatedServer } from '@ovh-ux/manager-models';

export default class Cluster {
  /* @ngInject */
  constructor($http, $q, Server) {
    this.$http = $http;
    this.$q = $q;
    this.Server = Server;
  }

  getSelected(serviceName) {
    return this.$http
      .get(`/dedicated/cluster/${serviceName}`)
      .then(({ data }) => data);
  }

  getServiceInfos(serviceName) {
    return this.$http
      .get(`/dedicated/cluster/${serviceName}/serviceInfos`)
      .then(({ data }) => data);
  }

  getCommercialName(serviceInfos) {
    const { serviceId } = serviceInfos;
    return this.$http
      .get(`/services/${serviceId}`)
      .then(({ data }) => data?.billing?.plan?.invoiceName);
  }

  /**
   * Retrieve all nodes from a cluster
   * @param {String} serviceName of the cluster (cluster ID)
   * @returns {DedicatedServer[]} list of nodes of the cluster
   */
  async getNodes(serviceName) {
    const cluster = await this.getSelected(serviceName);
    const serverNames = cluster.nodes?.map(({ serverName }) => serverName);
    const nodes = await this.$q.all(
      serverNames.map((serverName) =>
        this.Server.getSelected(serverName).then(
          (swsResponse) => new DedicatedServer(swsResponse),
        ),
      ),
    );

    return nodes;
  }
}
