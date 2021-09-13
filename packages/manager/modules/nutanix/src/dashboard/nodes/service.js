import { DedicatedServer } from '@ovh-ux/manager-models';

export default class NutanixNodeService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  updateDisplayName({ serviceId, displayName }) {
    return this.$http.put('/service/{serviceId}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceId,
      },
      data: {
        resource: {
          displayName,
        },
      },
    });
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
