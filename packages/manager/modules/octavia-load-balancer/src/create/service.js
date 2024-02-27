import {
  NETWORK_PRIVATE_VISIBILITY,
  FLOATING_IP_TYPE,
  FLOATING_IP_CREATE_DESCRIPTION,
} from './constants';

export default class OctaviaLoadBalancerCreateService {
  /* @ngInject */
  constructor($http, $q, $translate) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
  }

  getPrivateNetworks(projectId, regionName) {
    return this.$http
      .get(`/cloud/project/${projectId}/region/${regionName}/network`)
      .then(({ data }) =>
        data.filter(
          (network) => network.visibility === NETWORK_PRIVATE_VISIBILITY,
        ),
      );
  }

  getSubnets(projectId, regionName, privateNetwork) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${regionName}/network/${privateNetwork.id}/subnet`,
      )
      .then(({ data }) => {
        const subnets = data.map((subnet) => ({
          ...subnet,
          displayName: subnet.name
            ? `${subnet.name} - ${subnet.cidr}`
            : subnet.cidr,
        }));
        return subnets;
      });
  }

  getFloatingIps(projectId, regionName) {
    return this.$http
      .get(`/cloud/project/${projectId}/region/${regionName}/floatingip`)
      .then(({ data }) => {
        const availableFloatingIPs = data.reduce((filtered, floatingIp) => {
          if (!floatingIp.associatedEntity) {
            filtered.push({
              ...floatingIp,
              displayName: floatingIp.ip,
              type: FLOATING_IP_TYPE.IP,
            });
          }
          return filtered;
        }, []);

        return availableFloatingIPs;
      });
  }

  checkGateway(projectId, regionName, subnet) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${regionName}/gateway?subnetId=${subnet.id}`,
      )
      .then(({ data }) => data);
  }

  createLoadBalancer(
    projectId,
    size,
    regionName,
    floatingIp,
    privateNetwork,
    subnet,
    gateway,
    listeners,
    loadBalancerName,
  ) {
    const network = {
      private: {
        network: {
          id: privateNetwork.id,
          subnetId: subnet.id,
        },
      },
    };

    if (floatingIp.type === FLOATING_IP_TYPE.CREATE) {
      network.private.floatingIpCreate = {
        description: `${FLOATING_IP_CREATE_DESCRIPTION} ${loadBalancerName}`,
      };
    }

    if (
      ![FLOATING_IP_TYPE.CREATE, FLOATING_IP_TYPE.NO_IP].includes(
        floatingIp.type,
      )
    ) {
      network.private.floatingIp = {
        id: floatingIp.id,
      };
    }

    if (network.private.floatingIp || network.private.floatingIpCreate) {
      if (!gateway?.length) {
        network.private.gatewayCreate = {
          model: 's',
          name: `gateway-${regionName}`,
        };
      } else {
        network.private.gateway = {
          id: gateway[0].id,
        };
      }
    }

    const formattedListeners =
      listeners?.map((listener) => {
        const pool = {
          algorithm: 'roundRobin',
          protocol: listener.protocol.value,
        };

        const instances = listener.instances?.reduce((filtered, instance) => {
          if (Object.keys(instance).length > 0) {
            filtered.push({
              address: instance.instance.ipAddress.ip,
              protocolPort: instance.port,
            });
          }
          return filtered;
        }, []);

        if (listener.healthMonitor?.value) {
          pool.healthMonitor = {
            name: `health-monitor-${listener.healthMonitor.value}`,
            monitorType: listener.healthMonitor.value,
            maxRetries: 4,
            delay: 5,
            timeout: 4,
            httpConfiguration: {
              httpMethod: 'GET',
              urlPath: '/',
            },
          };
        }

        if (instances.length) {
          pool.members = instances;
        }

        return {
          port: listener.port,
          protocol: listener.protocol.value,
          pool,
        };
      }) || [];

    return this.getFlavorId(projectId, regionName, size).then((flavorId) => {
      return this.$http.post(
        `/cloud/project/${projectId}/region/${regionName}/loadbalancing/loadbalancer`,
        {
          flavorId,
          network,
          name: loadBalancerName,
          listeners: formattedListeners,
        },
      );
    });
  }

  getFlavorId(projectId, regionName, size) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${regionName}/loadbalancing/flavor`,
      )
      .then(
        ({ data }) =>
          data.find(
            (regionalizedFlavors) =>
              regionalizedFlavors.name === size.technicalName,
          )?.id,
      );
  }
}
