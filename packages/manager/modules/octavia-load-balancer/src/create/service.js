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
        const subnets = data.map((subnet) => ({
          ...subnet,
          displayName: subnet.name
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

  createLoadBalancer(
    projectId,
    size,
    regionName,
    privateNetwork,
    subnet,
    gateway,
    listeners,
    name,
  ) {
    const networkInformation = {
      networkId: privateNetwork.id,
      subnetId: subnet.id,
    };

    if (!gateway?.length) {
      networkInformation.gateway = {
        model: 's',
        name: `gateway-${regionName}`,
      };
    }

    const formattedListeners = listeners.map((listener) => {
      let pools;

      const instances = listener.instances?.reduce((filtered, instance) => {
        if (Object.keys(instance).length > 0) {
          filtered.push({
            address: instance.instance.ipAddress.ip,
            protocolPort: instance.port,
          });
        }
        return filtered;
      }, []);

      if (instances.length || listener.healthMonitor?.value) {
        pools = [
          {
            algorithm: 'roundRobin',
            default: true,
            protocol: listener.protocol.value,
          },
        ];

        if (listener.healthMonitor?.value) {
          pools[0].healthMonitor = {
            name: `health-monitor-${listener.healthMonitor.value}`,
            monitorType: listener.healthMonitor.value,
            maxRetries: 3,
            periodicity: 5,
            timeout: 5,
          };
        }

        if (instances.length) {
          pools[0].members = instances;
        }
      }

      return {
        port: listener.port,
        protocol: listener.protocol.value,
        pools,
      };
    });

    return this.getFlavorId(projectId, regionName, size).then((flavorId) => {
      // TODO: Add listeners when ticket 10670 is done
      return this.$http
        .post(
          `/cloud/project/${projectId}/region/${regionName}/loadbalancing/loadbalancer`,
          {
            flavorId,
            networkInformation,
            name,
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
              requestId: error.config.headers['X-OVH-MANAGER-REQUEST-ID'],
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
