import { DEFAULT_IP } from './add.constants';

export default class PrivateNetworkAddService {
  /* @ngInject */
  constructor($http, Poller) {
    this.$http = $http;
    this.Poller = Poller;
  }

  create(
    projectId,
    region,
    privateNetworkName,
    subnet,
    vlanId = null,
    gateway,
  ) {
    return this.$http
      .post(`/cloud/project/${projectId}/region/${region}/network`, {
        name: privateNetworkName,
        subnet,
        ...(gateway && { gateway }),
        ...(typeof vlanId === 'number' && { vlanId }),
      })
      .then(({ data: { id } }) =>
        this.checkPrivateNetworkCreationStatus(projectId, id),
      )
      .then(({ resourceId }) => {
        this.Poller.kill({ namespace: 'private-network-creation' });
        return this.getCreatedSubnet(projectId, region, resourceId);
      });
  }

  checkPrivateNetworkCreationStatus(projectId, operationId) {
    return this.Poller.poll(
      `/cloud/project/${projectId}/operation/${operationId}`,
      {},
      {
        method: 'get',
        successRule: {
          status: 'completed',
        },
        namespace: 'private-network-creation',
      },
    );
  }

  getCreatedSubnet(projectId, region, networkId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${region}/network/${networkId}/subnet`,
      )
      .then(({ data }) => data);
  }

  static generateNetworkAddress(vlanId) {
    return DEFAULT_IP.replace('{vlanId}', vlanId % 255);
  }

  getAllRegions(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/region`)
      .then(({ data }) => data);
  }

  getRegionInfo(projectId, region) {
    return this.$http
      .get(`/cloud/project/${projectId}/region/${region}`)
      .then(({ data }) => data);
  }

  associateGatewayToNetwork(projectId, region, gatewayId, subnetId) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/region/${region}/gateway/${gatewayId}/interface`,
        {
          subnetId,
        },
      )
      .then(({ data }) => data);
  }
}
