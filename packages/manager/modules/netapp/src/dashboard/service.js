import {
  FETCH_INTERVAL,
  NETWORK_STATUS,
  POLLING_TYPE,
  VRACK_ORDER_URLS,
  SNAPSHOT_TYPE,
} from './constants';

export default class NetAppDashboardService {
  /* @ngInject */
  constructor($http, $q, Apiv2Service, Poller, iceberg) {
    this.Apiv2Service = Apiv2Service;
    this.$http = $http;
    this.$q = $q;
    this.Poller = Poller;
    this.iceberg = iceberg;
  }

  /**
   * Get vrack list or resource from api
   * @param {*} id
   * @returns vrack list or resource from api
   */
  getVracks(id) {
    return this.iceberg(`/vrack${id ? `/${id}` : ''}`)
      .query()
      .expand('CachedObjectList-Pages')
      .execute().$promise;
  }

  /**
   * Get vrack services list or resource from api
   * @param {*} id
   * @returns vrack services list or resource
   */
  getVrackServices(id) {
    return this.Apiv2Service.httpApiv2({
      method: 'get',
      url: `/engine/api/v2/vrackServices/resource${id ? `/${id}` : ''}`,
    });
  }

  /**
   * GET storage network detail API call
   * and populate with detailled vrack services
   * @param {*} serviceName
   * @returns network object
   */
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

  /**
   * Get vrack Service URN from storage network
   * and populate network with detailled vrack services
   * @param {*} network
   * @returns network object populated with vrack services
   */
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

  /**
   * Parse URN to retrieve ID
   * @param {*} urn
   * @returns id retrieved from URN
   */
  static getVrackServicesIdFromUrn(urn) {
    return urn.split(':').pop();
  }

  /**
   * Get attached subnet / endpoint of storage
   * @param {*} networkInformations
   * @param {*} storage
   * @returns object with attached subnet and attached endpoint
   */
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

  // POLLING MANAGEMENT FUNCTIONS
  /**
   * Polling on storage network detail
   * Stop polling when status change from to_configure when associating
   * Stop polling when status change from associated when dissociating
   * @param {*} storage
   * @param {*} pollingType
   * @returns
   */
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
  // END POLLING MANAGEMENT FUNCTIONS

  /**
   * Get vrack express order Link
   * @param {*} subsidiary
   * @returns string corresponding to the order link
   */
  static getVrackOrderUrl(subsidiary) {
    return VRACK_ORDER_URLS[subsidiary] || VRACK_ORDER_URLS.DEFAULT;
  }

  /**
   * Filter allowed vracks depending of the vrack services
   * @param {*} vracks array of vrack
   * @param {*} vrackServicesId
   * @returns array of vrack available for association for the vrack services id in parameter
   */
  filterAllowedVrack(vracks, vrackServicesId) {
    // Check if user vracks have allowed services to add them in the available list
    const allowedServicesPromises = vracks.map((vrack) =>
      this.getAllowedVrackServices(vrack.internalName).then((data) => ({
        ...data,
        vrack,
      })),
    );

    return this.$q
      .all(allowedServicesPromises)
      .then((data) =>
        data.filter((vrackAllowedServices) =>
          vrackAllowedServices.vrackServices.includes(vrackServicesId),
        ),
      );
  }

  /**
   * Get allowed services api call
   * @param {*} vrackId
   * @returns result of allowed vrack services for a vrack
   */
  getAllowedVrackServices(vrackId) {
    return this.$http
      .get(`/vrack/${vrackId}/allowedServices?serviceFamily=vrackServices`)
      .then(({ data }) => data);
  }

  /**
   * Update the EFS name
   * @param {string} storageId
   * @param {string} name
   * @returns
   */
  updateStorageName(storageId, name) {
    return this.$http.put(`/storage/netapp/${storageId}`, {
      name,
    });
  }

  getListOfAccessPath(serviceName, volumes) {
    return this.$q
      .all(volumes.map((volume) => this.getAccessPath(serviceName, volume)))
      .then((result) => result.flat());
  }

  getAccessPath(serviceName, volume) {
    return this.$http
      .get(`/storage/netapp/${serviceName}/share/${volume.id}/accessPath`)
      .then(({ data }) => {
        return {
          ...volume,
          path: data.map(({ path }) => path),
        };
      });
  }

  /**
   * Get Manual snapshots
   * @param {*} eligibleVolumes array of volumes
   * @param {*} storage
   * @returns Result of all manual snapshots
   */

  getManualsnapshots(eligibleVolumes, storage) {
    return this.$q.all(
      eligibleVolumes.map((volume) =>
        this.getManualsnapshotsFromVolume(volume, storage),
      ),
    );
  }

  getManualsnapshotsFromVolume(volume, storage) {
    return this.$http
      .get(
        `/storage/netapp/${storage.id}/share/${volume.id}/snapshot?detail=true`,
      )
      .then(({ data: shareSnapshot }) => {
        return shareSnapshot
          .filter(({ type }) => type === SNAPSHOT_TYPE.MANUAL)
          .map((snapshot) => {
            return {
              size: volume.size,
              snapshotID: snapshot.id,
              key: snapshot.name
                ? `${storage.name} : ${snapshot.name}`
                : storage.name,
            };
          });
      });
  }
}
