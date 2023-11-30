export default class NetAppNetworkDeleteService {
  /* @ngInject */
  constructor(Apiv2Service) {
    this.Apiv2Service = Apiv2Service;
  }

  deleteEndpoint(storage, networkInformations) {
    const { vrackServices } = networkInformations;
    const vrackServicesId = networkInformations.vrackServicesURN;
    const serviceURN = storage.iam.urn;

    // Deep copy currentState to create targetSpec
    const targetSpec = angular.copy(vrackServices.currentState);
    // Search in subnets the service endpoint to remove
    targetSpec.subnets.some((subnet) => {
      const indexEndpointToremove = subnet.serviceEndpoints.findIndex(
        (endpoint) => endpoint.managedServiceURN === serviceURN,
      );
      if (indexEndpointToremove === -1) return false;
      subnet.serviceEndpoints.splice(indexEndpointToremove, 1);
      return true;
    });
    // Replace the target spec and update the vrack services
    vrackServices.targetSpec = targetSpec;
    return this.Apiv2Service.httpApiv2({
      method: 'put',
      url: `/engine/api/v2/vrack-services/resource/${vrackServicesId}`,
      data: vrackServices,
    });
  }
}
