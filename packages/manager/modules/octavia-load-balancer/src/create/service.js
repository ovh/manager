import { NETWORK_PRIVATE_VISIBILITY } from './constants';

export default class OctaviaLoadBalancerCreateService {
  /* @ngInject */
  constructor($http, $q, $translate, Alerter) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.Alerter = Alerter;
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
        const subnets = data.reduce((filtered, subnet) => {
          if (subnet.gatewayIp) {
            filtered.push({
              ...subnet,
              displayName: subnet.name
                ? `${subnet.name} - ${subnet.cidr}`
                : subnet.cidr,
            });
          }
          return filtered;
        }, []);
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

  createLoadBalancer(
    projectId,
    size,
    regionName,
    privateNetwork,
    subnet,
    gateway,
    listeners,
    loadBalancerName,
  ) {
    const network = {
      private: {
        floatingIpCreate: {
          description: loadBalancerName,
        },
        network: {
          id: privateNetwork.id,
          subnetId: subnet.id,
        },
      },
    };

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

    const formattedListeners = listeners.map((listener) => {
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
          periodicity: 'PT5S',
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
    });

    return this.getFlavorId(projectId, regionName, size).then((flavorId) => {
      return this.$http
        .post(
          `/cloud/project/${projectId}/region/${regionName}/loadbalancing/loadbalancer`,
          {
            flavorId,
            network,
            name: loadBalancerName,
            listeners: formattedListeners,
          },
        )
        .then(({ data }) => {
          this.Alerter.set(
            'alert-info',
            this.$translate.instant('octavia_load_balancer_create_banner'),
            null,
            'octavia.alerts.global',
          );
          return data;
        })
        .catch((error) => {
          this.Alerter.error(
            this.$translate.instant('octavia_load_balancer_global_error', {
              message: error.data.message,
              requestId: error.headers('X-Ovh-Queryid'),
            }),
            'octavia.alerts.global',
          );
          throw error;
        });
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
