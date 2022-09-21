import sortBy from 'lodash/sortBy';
import {
  DELETING_STATUS,
  VRACK_CREATION_ACTION,
} from './private-networks.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $http,
    $translate,
    OvhApiCloudProject,
    OvhApiCloudProjectNetworkPrivate,
    OvhApiCloudProjectNetworkPrivateSubnet,
  ) {
    this.$q = $q;
    this.$http = $http;
    this.$translate = $translate;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiCloudProjectNetworkPrivate = OvhApiCloudProjectNetworkPrivate;
    this.OvhApiCloudProjectNetworkPrivateSubnet = OvhApiCloudProjectNetworkPrivateSubnet;
  }

  getPrivateNetworks(serviceName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/network/private`)
      .then(({ data }) =>
        sortBy(data, 'vlanId').filter(
          ({ status }) => !DELETING_STATUS.includes(status),
        ),
      );
  }

  getSubnets(serviceName, id) {
    return this.$http
      .get(`/cloud/project/${serviceName}/network/private/${id}/subnet`)
      .then(({ data }) => data);
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

  getGateways(serviceName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/aggregated/gateway`)
      .then(({ data }) => data);
  }
}
