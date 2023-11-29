export default class NetAppNetworkConfigurationService {
  /* @ngInject */
  constructor(Apiv2Service) {
    this.Apiv2Service = Apiv2Service;
  }

  getVrackServices() {
    return this.Apiv2Service.httpApiv2({
      method: 'get',
      url: '/engine/api/v2/vrack-services/resource',
    });
  }

  linkVrackServiceToEfs(vrackService, subnet, efs) {
    const vs = vrackService;
    // create deep copy of currentState
    vs.targetSpec = angular.copy(vs.currentState);

    // Search the subnet to modify within the vrackServices subnets array
    const subnetToModify = vs.targetSpec.subnets.find(
      (vrSubnet) => vrSubnet.cidr === subnet.cidr,
    );

    // Add the EFS urn as a service endpoint of the selected subnet
    subnetToModify.serviceEndpoints.push({
      managedServiceUrn: efs.iam.urn,
    });

    return this.Apiv2Service.httpApiv2({
      method: 'put',
      url: `/engine/api/v2/vrack-services/resource/${vs.id}`,
      data: vs,
    });
  }
}
