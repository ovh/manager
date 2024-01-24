import sortBy from 'lodash/sortBy';
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

  getPrivateNetworks(serviceName, customerRegions = []) {
    return this.$http
      .get(`/cloud/project/${serviceName}/aggregated/network`)
      .then(({ data }) => {
        const privateNetworks = {};
        const localZones =
          customerRegions?.filter(({ type }) => type.includes('localzone')) ||
          [];
        data.resources.forEach((network) => {
          if (
            network.visibility === 'private' &&
            !localZones?.some((region) => region.name === network.region)
          ) {
            if (!privateNetworks[network.vlanId]) {
              const { id, region, ...rest } = network;
              privateNetworks[network.vlanId] = {
                ...rest,
                region,
                subnets: [{ region, networkId: id }],
              };
            } else {
              const { id, region } = network;
              privateNetworks[network.vlanId].subnets.push({
                region,
                networkId: id,
              });
            }
          }
        });
        return sortBy(Object.values(privateNetworks), 'vlanId');
      });
  }

  getLocalPrivateNetworks(serviceName, customerRegions) {
    return this.$http
      .get(`/cloud/project/${serviceName}/aggregated/network`)
      .then(({ data }) => {
        const localZones = customerRegions.filter(({ type }) =>
          type.includes('localzone'),
        );
        const localZoneNetworks = data.resources.filter((network) => {
          return (
            network.visibility === 'private' &&
            localZones.some((region) => region.name === network.region)
          );
        });

        return this.$q.all(
          localZoneNetworks.map((network) =>
            this.getSubnets(serviceName, network.region, network.id).then(
              (subnet) => {
                const allocatedIp = subnet.allocationPools
                  .map((ipPool) => `${ipPool.start} - ${ipPool.end}`)
                  .join(' ,');
                return { allocatedIp, ...subnet, ...network };
              },
            ),
          ),
        );
      });
  }

  getSubnets(serviceName, region, networkId) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/region/${region}/network/${networkId}/subnet`,
      )
      .then(({ data }) => data[0])
      .catch(() => {});
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

  deleteSubnet(serviceName, region, networkId) {
    return this.$http
      .delete(
        `/cloud/project/${serviceName}/region/${region}/network/${networkId}`,
      )
      .then(({ data }) => data);
  }

  getGateways(serviceName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/aggregated/gateway`)
      .then(({ data }) => data);
  }
}
