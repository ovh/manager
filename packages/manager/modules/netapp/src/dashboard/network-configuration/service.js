export default class NetAppNetworkConfigurationService {
  /* @ngInject */
  constructor($http, $q, Apiv2Service) {
    this.$http = $http;
    this.$q = $q;
    this.Apiv2Service = Apiv2Service;
  }

  linkVrackServiceToEfs(vrackId, vs, subnet, efs) {
    const vrackServices = vs;

    // create deep copy of targetSpec
    const targetSpec = angular.copy(vrackServices.targetSpec);

    // Search the subnet to modify within the vrackServices subnets array
    const subnetToModify = targetSpec.subnets.find(
      (vrSubnet) => vrSubnet.cidr === subnet.cidr,
    );

    // Add the EFS urn as a service endpoint of the selected subnet
    subnetToModify.serviceEndpoints.push({
      managedServiceURN: efs.iam.urn,
    });

    let promise;

    // If the vrack services don't already have associated vrack, we do the vRack association
    if (!vrackServices.currentState.vrackId) {
      promise = this.$http.post(`/vrack/${vrackId}/vrackServices`, {
        vrackServices: vrackServices.id,
      });
    } else {
      promise = this.$q.resolve();
    }

    return promise
      .then(() => ({
        vrackAssociationStatus: {
          success: true,
        },
      }))
      .catch((error) => ({
        // If the vRack association failed, we retrieve the error to have it on the global response
        vrackAssociationStatus: {
          success: false,
          message: error?.data?.message || error.message,
          requestId: error.headers('X-Ovh-Queryid'),
        },
      }))
      .then((vrackAssociationStatus) =>
        this.Apiv2Service.httpApiv2({
          method: 'put',
          url: `/engine/api/v2/vrackServices/resource/${vs.id}`,
          data: {
            checksum: vrackServices.checksum,
            targetSpec,
          },
        }).then(({ data }) => ({
          ...vrackAssociationStatus,
          data,
        })),
      );
  }
}
