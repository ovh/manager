export default class NetAppNetworkDeleteService {
  /* @ngInject */
  constructor(Apiv2Service) {
    this.Apiv2Service = Apiv2Service;
  }

  deleteEndpoint(storage, networkInformations) {
    const { vrackServices } = networkInformations;
    const serviceURN = storage.iam.urn;

    // Deep copy targetSpec
    const targetSpec = angular.copy(vrackServices.targetSpec);

    // Search in subnets the service endpoint to remove
    targetSpec.subnets.some((subnet) => {
      const indexEndpointToremove = subnet.serviceEndpoints.findIndex(
        (endpoint) => endpoint.managedServiceURN === serviceURN,
      );
      if (indexEndpointToremove === -1) return false;
      subnet.serviceEndpoints.splice(indexEndpointToremove, 1);
      return true;
    });

    // create the payload
    const payload = {
      checksum: vrackServices.checksum,
      targetSpec,
    };

    return this.Apiv2Service.httpApiv2({
      method: 'put',
      url: `/engine/api/v2/vrackServices/resource/${vrackServices.id}`,
      data: payload,
    });
  }
}
