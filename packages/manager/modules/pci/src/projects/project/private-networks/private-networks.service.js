import sortBy from 'lodash/sortBy';
import {
  DELETING_STATUS,
  VRACK_CREATION_ACTION,
} from './private-networks.constants';

export default class {
  /* @ngInject */
  constructor($q, $http, $translate, OvhApiCloudProject) {
    this.$q = $q;
    this.$http = $http;
    this.$translate = $translate;
    this.OvhApiCloudProject = OvhApiCloudProject;
  }

  getPrivateNetworks(serviceName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/network/private`)
      .then(({ data: privateNetworks }) => {
        return sortBy(privateNetworks, 'vlanId').filter(
          ({ status }) => !DELETING_STATUS.includes(status),
        );
      });
  }

  getSubnets(serviceName, networkId) {
    return this.$http
      .get(`/cloud/project/${serviceName}/network/private/${networkId}/subnet`)
      .then((data) => data);
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

  deleteSubnet(serviceName, networkId, subnetId) {
    return this.$http
      .delete(
        `/cloud/project/${serviceName}/network/private/${networkId}/subnet/${subnetId}`,
      )
      .then(({ data }) => data);
  }
}
