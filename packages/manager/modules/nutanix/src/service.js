import { DedicatedServer } from '@ovh-ux/manager-models';

export default class NutanixService {
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
        rootPath: '2api',
        urlParams: {
          serviceName: nodeId,
        },
      })
      .then((data) => new DedicatedServer(data));
  }
}
