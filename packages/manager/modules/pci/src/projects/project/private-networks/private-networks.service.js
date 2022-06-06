import sortBy from 'lodash/sortBy';

import {
  DELETING_STATUS,
  VRACK_CREATION_ACTION,
} from './private-networks.constants';

export default class {
  /* @ngInject */
  constructor(OvhApiCloudProject, OvhApiCloudProjectNetworkPrivate) {
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiCloudProjectNetworkPrivate = OvhApiCloudProjectNetworkPrivate;
  }

  getPrivateNetworks(serviceName) {
    this.OvhApiCloudProjectNetworkPrivate.v6().resetQueryCache();
    return this.OvhApiCloudProjectNetworkPrivate.v6()
      .query({
        serviceName,
      })
      .$promise.then((privateNetworks) =>
        sortBy(privateNetworks, 'vlanId').filter(
          ({ status }) => !DELETING_STATUS.includes(status),
        ),
      );
  }

  getVrack(serviceName) {
    return this.OvhApiCloudProject.v6()
      .vrack({
        serviceName,
      })
      .$promise.catch((error) =>
        error.status === 404 ? {} : Promise.reject(error),
      );
  }

  getVrackCreationOperation(serviceName) {
    return this.OvhApiCloudProject.v6()
      .operations({
        serviceName,
      })
      .$promise.then((operations) =>
        operations.find(({ action }) => action === VRACK_CREATION_ACTION),
      );
  }

  getNetworks(serviceName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/network/private`)
      .then(({ data }) => data);
  }
}
