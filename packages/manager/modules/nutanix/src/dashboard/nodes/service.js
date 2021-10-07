import { DedicatedServer } from '@ovh-ux/manager-models';

export default class NutanixNodeService {
  /* @ngInject */
  constructor($q, $http) {
    this.$q = $q;
    this.$http = $http;
  }

  updateDisplayName({ serviceId, displayName }) {
    return this.$http.put(`/service/${serviceId}`, {
      resource: {
        displayName,
      },
    });
  }

  getNodeDetails(nodes) {
    return this.$q
      .all(nodes.map((node) => this.getServer(node.server)))
      .then((res) => res);
  }

  getServer(nodeId) {
    return this.$http
      .get(`/sws/dedicated/server/${nodeId}`, {
        serviceType: 'aapi',
        urlParams: {
          serviceName: nodeId,
        },
      })
      .then(({ data }) => new DedicatedServer(data));
  }
}
