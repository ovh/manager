import { FETCH_INTERVAL, NETWORK_STATUS, POLLING_TYPE } from './constants';

export default class NetAppDashboardService {
  /* @ngInject */
  constructor($http, $q, Apiv2Service, Poller) {
    this.Apiv2Service = Apiv2Service;
    this.$http = $http;
    this.$q = $q;
    this.Poller = Poller;
  }

  getVrackServices(id) {
    return this.Apiv2Service.httpApiv2({
      method: 'get',
      url: `/engine/api/v2/vrack-services/resource${id ? `/${id}` : ''}`,
    });
  }

  getNetworkInformations(serviceName) {
    // TODO: To mock until API is ready (STORAGE-8593)
    return this.$http
      .get(`/storage/netapp/${serviceName}/network`)
      .then(({ data: networkData }) => {
        if (networkData.length === 0) return null;
        const network = networkData[0];
        if (network.vrackServicesURN)
          return this.populateStorageNetwork(network);
        return network;
      });
  }

  populateStorageNetwork(network) {
    if (!network.vrackServicesURN) return this.$q.resolve(network);
    return this.getVrackServices(network.vrackServicesURN).then(({ data }) => {
      const populatedNetwork = network;
      populatedNetwork.vrackServices = data;
      return populatedNetwork;
    });
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
      `/storage/netapp/${storage.name}/network`,
      {},
      {
        namespace: `network_${storage.name}_${pollingType}`,
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
    this.Poller.kill({ namespace: `network_${storage.name}_${pollingType}` });
  }
}
