import { VRACK_CREATION_ACTION } from './private-networks.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $http,
    $translate,
    OvhApiCloudProject,
    OvhApiCloudProjectNetworkPrivate,
    OvhApiCloudProjectNetworkPrivateSubnet,
  ) {
    this.$q = $q;
    this.$http = $http;
    this.$translate = $translate;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiCloudProjectNetworkPrivate = OvhApiCloudProjectNetworkPrivate;
    this.OvhApiCloudProjectNetworkPrivateSubnet = OvhApiCloudProjectNetworkPrivateSubnet;
  }

  getPrivateNetworks(serviceName) {
    this.OvhApiCloudProjectNetworkPrivate.v6().resetQueryCache();
    return this.OvhApiCloudProjectNetworkPrivate.v6()
      .query({
        serviceName,
      })
      .$promise.then((privateNetworks) =>
        this.$q.all(
          privateNetworks.map((privateNetwork) =>
            this.getSubnets(serviceName, privateNetwork),
          ),
        ),
      );
  }
  // TODO: getSubnets call need to trigger on expanding the rows for which we need to update expandable data grid under UI kit. currently calling it under getPrivateNetworks

  getSubnets(serviceName, privateNetwork) {
    return this.OvhApiCloudProjectNetworkPrivateSubnet.v6()
      .query({
        serviceName,
        networkId: privateNetwork.id,
      })
      .$promise.then((data) => {
        return {
          ...privateNetwork,
          subnet: [
            ...data.map((subnet) => ({
              ...subnet,
              allocatedIp: subnet.ipPools
                .map((ipPool) => `${ipPool.start} - ${ipPool.end}`)
                .join(' ,'),
              dhcp: subnet.ipPools
                .map((ipPool) =>
                  ipPool.dhcp === true
                    ? this.$translate.instant(
                        'pci_projects_project_network_private_dhcp_active',
                      )
                    : this.$translate.instant(
                        'pci_projects_project_network_private_dhcp_suspended',
                      ),
                )
                .join(),
            })),
          ],
        };
      });
  }

  getVrack(serviceName) {
    return this.OvhApiCloudProject.v6()
      .vrack({
        serviceName,
      })
      .$promise.catch((error) =>
        error.status === 404 ? {} : Promise.reject(error),
      );
  }

  getVrackCreationOperation(serviceName) {
    return this.OvhApiCloudProject.v6()
      .operations({
        serviceName,
      })
      .$promise.then((operations) =>
        operations.find(({ action }) => action === VRACK_CREATION_ACTION),
      );
  }

  deleteSubnet(serviceName, networkId, subnetId) {
    return this.$http
      .delete(
        `/cloud/project/${serviceName}/network/private/${networkId}/subnet/${subnetId}`,
      )
      .then(({ data }) => data);
  }
}
