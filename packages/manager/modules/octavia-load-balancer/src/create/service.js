import { NETWORK_PRIVATE_VISIBILITY } from './constants';

export default class OctaviaLoadBalancerCreateService {
  /* @ngInject */
  constructor($q, $http) {
    this.$q = $q;
    this.$http = $http;
  }

  getPrivateNetworks(projectId, regionName) {
    return this.$http
      .get(`/cloud/project/${projectId}/region/${regionName}/network`)
      .then(({ data }) => {
        const privateNetworks = data.filter(
          (network) => network.visibility === NETWORK_PRIVATE_VISIBILITY,
        );
        return privateNetworks;
      });
  }

  getSubnets(projectId, regionName, privateNetwork) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${regionName}/network/${privateNetwork.id}/subnet`,
      )
      .then(({ data }) => {
        const subnets = data.map((subnet) => ({
          ...subnet,
          displayName:
            subnet.name !== ''
              ? `${subnet.name} - ${subnet.cidr}`
              : subnet.cidr,
        }));
        return subnets;
      });
  }

  checkGateway(projectId, regionName, subnet) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${regionName}/gateway?subnetId=${subnet.id}`,
      )
      .then(({ data }) => data);
  }
}
