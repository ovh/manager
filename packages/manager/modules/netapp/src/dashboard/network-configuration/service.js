import { VRACK_ORDER_URLS } from './constants';

export default class NetAppNetworkConfigurationService {
  /* @ngInject */
  constructor($http, $q, Apiv2Service) {
    this.$http = $http;
    this.$q = $q;
    this.Apiv2Service = Apiv2Service;
    this.VRACK_ORDER_URLS = VRACK_ORDER_URLS;
  }

  getAllowedVrackServices(vrackId) {
    return this.$http
      .get(`/vrack/${vrackId}/allowedServices`)
      .then(({ data }) => data);
  }

  getVrackOrderUrl(subsidiary) {
    return this.VRACK_ORDER_URLS[subsidiary] || this.VRACK_ORDER_URLS.DEFAULT;
  }

  linkVrackServiceToEfs(vrackId, vrackService, subnet, efs) {
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

    let promise;

    // If the vrack services don't already have associated vrack, we do the vRack association
    if (!vs.targetSpec.vrackId) {
      promise = this.$http.post(`/vrack/${vrackId}/vrackServices`, {
        vrackServices: vs.id,
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
          url: `/engine/api/v2/vrack-services/resource/${vs.id}`,
          data: vs,
        }).then(({ data }) => ({
          ...vrackAssociationStatus,
          data,
        })),
      );
  }
}
