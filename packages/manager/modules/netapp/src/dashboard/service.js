import { FETCH_INTERVAL, NETWORK_STATUS, POLLING_TYPE } from './constants';

export default class NetAppDashboardService {
  /* @ngInject */
  constructor($http, $q, Apiv2Service, Poller, iceberg) {
    this.Apiv2Service = Apiv2Service;
    this.$http = $http;
    this.$q = $q;
    this.Poller = Poller;
    this.iceberg = iceberg;
  }

  getVracks(id) {
    return this.iceberg(`/vrack${id ? `/${id}` : ''}`)
      .query()
      .expand('CachedObjectList-Pages')
      .execute().$promise;
  }

  getVrackServices(id) {
    return this.Apiv2Service.httpApiv2({
      method: 'get',
      url: `/engine/api/v2/vrackServices/resource${id ? `/${id}` : ''}`,
    });
  }

  getNetworkInformations(serviceName) {
    return this.$http
      .get(`/storage/netapp/${serviceName}/network?detail=true`)
      .then(({ data: networkData }) => {
        if (networkData.length === 0) return null;
        const network = networkData[0];
        if (network.vRackServicesURN)
          return this.populateStorageNetwork(network);
        return network;
      });
  }

  populateStorageNetwork(network) {
    if (!network.vRackServicesURN) return this.$q.resolve(network);
    const vRackServicesId = this.constructor.getVrackServicesIdFromUrn(
      network.vRackServicesURN,
    );
    return this.getVrackServices(vRackServicesId).then(({ data }) => {
      const populatedNetwork = network;
      populatedNetwork.vRackServicesId = vRackServicesId;
      populatedNetwork.vrackServices = data;
      return populatedNetwork;
    });
  }

  static getVrackServicesIdFromUrn(urn) {
    return urn.split(':').pop();
  }

  static getAttachedSubnetAndEndpoint(networkInformations, storage) {
    let attachedEndpoint = {};
    const attachedSubnet = networkInformations.vrackServices
      ? networkInformations.vrackServices.currentState.subnets.find((subnet) =>
          subnet.serviceEndpoints.find((endpoint) => {
            if (endpoint.managedServiceURN !== storage.iam.urn) return false;
            attachedEndpoint = endpoint;
            return true;
          }),
        )
      : {};
    return { attachedSubnet, attachedEndpoint };
  }

  startNetworkPolling(storage, pollingType) {
    return this.Poller.poll(
      `/storage/netapp/${storage.id}/network?detail=true`,
      {},
      {
        namespace: `network_${storage.id}_${pollingType}`,
        interval: FETCH_INTERVAL,
        method: 'get',
        successRule: (data) =>
          (pollingType === POLLING_TYPE.ASSOCIATING &&
            data.status !== NETWORK_STATUS.TO_CONFIGURE) ||
          (pollingType === POLLING_TYPE.DISSOCIATING &&
            data.status !== NETWORK_STATUS.ASSOCIATED),
      },
    );
  }

  stopNetworkPolling(storage, pollingType) {
    this.Poller.kill({ namespace: `network_${storage.id}_${pollingType}` });
  }
}
