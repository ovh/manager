import { BillingService, DedicatedServer } from '@ovh-ux/manager-models';
import {
  NOT_SUBSCRIBED,
  SERVER_OPTIONS,
  NUTANIX_SERVICE_TYPE,
  IAM_RESOURCE_SERVICES_PREFIX,
  IAM_ACTION_SERVICES,
  IAM_ACTION_SUPPORT,
  NUTANIX_AUTHORIZATION_TYPE,
} from './constants';
import Cluster from './cluster.class';
import Node from './node.class';
import TechnicalDetails from './technical-details.class';

export default class NutanixService {
  /* @ngInject */
  constructor($q, $http, $translate, iceberg) {
    this.$q = $q;
    this.$http = $http;
    this.$translate = $translate;
    this.iceberg = iceberg;
  }

  getClusters() {
    return this.iceberg('/nutanix')
      .query()
      .expand('CachedObjectList-Pages')
      .execute({}, true)
      .$promise.then(({ data }) => {
        return data.map((cluster) => new Cluster(cluster));
      });
  }

  getCluster(serviceName) {
    return this.$http
      .get(`/nutanix/${serviceName}`)
      .then(({ data }) => new Cluster(data));
  }

  /**
   *
   * @param {string} nodeServiceName
   * @param {cluster[]} clusters
   * @returns {*} - cluster if found, null otherwise
   */
  static getClusterByNodeName(nodeServiceName, clusters = []) {
    // return cluster for a given node
    return clusters.find((cluster) =>
      cluster.targetSpec.nodes.find((n) => n.server === nodeServiceName),
    );
  }

  updateCluster(serviceName, redeploycluster = false, cluster) {
    return this.$http
      .put(
        `/nutanix/${serviceName}?redeploycluster=${redeploycluster}`,
        cluster,
      )
      .then(({ data }) => data);
  }

  getServiceInfo(serviceName) {
    return this.$http.get(`/nutanix/${serviceName}/serviceInfos`).then(
      ({ data }) =>
        new BillingService({
          serviceType: NUTANIX_SERVICE_TYPE,
          ...data,
        }),
    );
  }

  getServiceDetails(serviceId) {
    return this.$http.get(`/service/${serviceId}`).then(({ data }) => data);
  }

  getServicesDetails(serviceId) {
    return this.$http.get(`/services/${serviceId}`).then(({ data }) => data);
  }

  getAllServicesDetails(serviceId) {
    return this.$q
      .all([
        this.getServicesDetails(serviceId),
        this.getServiceOptions(serviceId),
      ])
      .then(([serviceDetails, optionsDetails]) => ({
        serviceDetails,
        optionsDetails,
      }));
  }

  static getServicesTotalPrice(serviceDetails, optionsDetails) {
    const optionsPrices = optionsDetails.reduce((sum, service) => {
      const price = service.billing?.pricing?.priceInUcents || 0;
      return sum + price;
    }, 0);

    return {
      priceInUcents:
        optionsPrices + serviceDetails.billing?.pricing.priceInUcents,
      currency: serviceDetails.billing?.pricing?.price?.currencyCode,
    };
  }

  getNodeHardwareInfo(nodeId) {
    return this.$http
      .get(`/dedicated/technical-details/${nodeId}`, {
        serviceType: 'aapi',
      })
      .then(({ data }) =>
        data?.baremetalServers?.storage
          ? new TechnicalDetails(data.baremetalServers, this.$translate)
          : null,
      )
      .catch(() => null);
  }

  getClusterHardwareInfo(serviceId, nodeServiceId) {
    return this.getServiceOptions(serviceId)
      .then((options) => {
        const optionsServiceId = new Set([nodeServiceId, serviceId]);
        options.forEach((option) => {
          optionsServiceId.add(option.serviceId);
        });
        return this.$q.all(
          [...optionsServiceId].map((optionServiceId) => {
            return this.getHardwareInfo(optionServiceId).then(
              (hardwareInfo) => {
                return {
                  ...hardwareInfo,
                  serviceId: optionServiceId,
                };
              },
            );
          }),
        );
      })
      .then((optionsHardwareInfo) =>
        NutanixService.transformHardwareInfo(optionsHardwareInfo),
      );
  }

  /**
   * extract hardware info from all options
   * @param {*} optionsHardwareInfo
   */
  static transformHardwareInfo(optionsHardwareInfo) {
    const baremetalServers = {};
    let nutanixCluster = {};
    optionsHardwareInfo.forEach((hardwareInfo) => {
      if (hardwareInfo.baremetalServers) {
        const keys = Object.keys(hardwareInfo.baremetalServers);
        keys.forEach((key) => {
          if (hardwareInfo.baremetalServers[key]) {
            const value = hardwareInfo.baremetalServers[key];
            if (key === 'storage' && baremetalServers[key]) {
              baremetalServers[key].disks = [
                ...baremetalServers[key].disks,
                ...value.disks,
              ];
            } else {
              baremetalServers[key] = {
                ...value,
                serviceId: hardwareInfo.serviceId,
              };
            }
          }
        });
      }
      if (hardwareInfo.nutanixCluster) {
        // only one nutanix cluster, no need merge the results
        nutanixCluster = hardwareInfo.nutanixCluster;
      }
    });
    return {
      baremetalServers,
      nutanixCluster,
    };
  }

  getServiceOptions(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/options`)
      .then(({ data }) => data);
  }

  getHardwareInfo(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/technicalDetails`)
      .then(({ data }) => data);
  }

  getServiceUpgradeOptions(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/upgrade`)
      .then(({ data }) => data);
  }

  getNodeDetails(cluster) {
    return this.$q
      .all(cluster.getNodes().map((node) => this.getServer(node.server)))
      .then((nodes) => {
        const nodesWithStatus = nodes;
        cluster.getNodes().forEach((nodeDetail) => {
          const nodeIndex = nodesWithStatus.findIndex(
            (node) => node.name === nodeDetail.server,
          );

          if (nodeIndex < 0) return;

          nodesWithStatus[nodeIndex] = new Node({
            ...nodes[nodeIndex],
            ...nodeDetail,
          });
        });

        return nodesWithStatus;
      });
  }

  getServer(nodeId) {
    return this.$http
      .get(`/sws/dedicated/server/${nodeId}`, {
        serviceType: 'aapi',
        urlParams: {
          serviceName: nodeId,
        },
      })
      .then(({ data }) => new DedicatedServer(data));
  }

  getBandwidthOptions(nodeId) {
    return this.$q
      .all({
        bandwidth: this.getBandwidth(nodeId),
        bandwidthVrackOption: this.getBandwidthOption(
          nodeId,
          SERVER_OPTIONS.BANDWIDTH_VRACK,
        ),
        bandwidthVrackOrderOptions: this.getOrderableBandwidths(nodeId),
      })
      .then(({ bandwidth, bandwidthVrackOption, bandwidthVrackOrderOptions }) =>
        this.getBandwidthOption(nodeId, SERVER_OPTIONS.BANDWIDTH).then(
          (bandwidthOption) => ({
            bandwidth,
            bandwidthOption,
            bandwidthVrackOption,
            bandwidthVrackOrderOptions,
          }),
        ),
      );
  }

  getOrderableBandwidths(productId) {
    return this.getOrderables(productId, 'bandwidthvRack')
      .then((response) => this.transformOrderableBandwidths(response.vrack))
      .catch((error) => error);
  }

  getOrderables(productId, optionName) {
    return this.$http
      .get(`/dedicated/server/${productId}/orderable/${optionName}`)
      .then(({ data }) => data)
      .catch((err) => {
        if (err.status === 460 || err.status === 400) {
          return {};
        }
        return this.$q.reject(err);
      });
  }

  transformOrderableBandwidths(bandwidths) {
    return bandwidths.map((bandwidth) => ({
      value: bandwidth,
      unit: 'mbps',
      text: this.$translate.instant('nutanix_cluster_unit_gbps', {
        t0: Math.floor(bandwidth / 1000),
      }),
    }));
  }

  getBandwidth(productId) {
    return this.$http
      .get(`/dedicated/server/${productId}/specifications/network`)
      .then(({ data }) => data)
      .catch((err) => {
        if (err.status === 404 || err.status === 460) {
          return {};
        }
        return this.$q.reject(err);
      });
  }

  getBandwidthOption(productId, serverOption) {
    return this.$http
      .get(`/dedicated/server/${productId}/option/${serverOption}`)
      .then(({ state }) => state)
      .catch((error) => {
        if (error.status === 404 || error.status === 460) {
          return NOT_SUBSCRIBED;
        }
        return this.$q.reject(error);
      });
  }

  getDedicatedInstallTemplateApiSchema() {
    return this.$http.get('/dedicated/server.json').then(({ data }) => data);
  }

  getUserResources() {
    return this.$http.get('/engine/api/v2/iam/resource', {
      serviceType: 'api',
    });
  }

  async checkIAMAccountAuthorizations(ressources) {
    const accountRessource = ressources.find((ressource) =>
      ressource.urn.includes(IAM_RESOURCE_SERVICES_PREFIX),
    );

    const { data: authorizations } = await this.$http.post(
      `/engine/api/v2/iam/resource/${encodeURI(
        accountRessource.urn,
      )}/authorization/check`,
      { actions: [...IAM_ACTION_SERVICES, ...IAM_ACTION_SUPPORT] },
      {
        serviceType: 'api',
      },
    );

    return {
      [NUTANIX_AUTHORIZATION_TYPE.SERVICES]: IAM_ACTION_SERVICES.every(
        (action) => authorizations.authorizedActions.includes(action),
      ),
      [NUTANIX_AUTHORIZATION_TYPE.SUPPORT]: IAM_ACTION_SUPPORT.every((action) =>
        authorizations.authorizedActions.includes(action),
      ),
    };
  }

  updateClusterNodePowerStateOn(nodeId) {
    return this.$http
      .put(`/dedicated/server/${nodeId}`, {
        bootId: 1,
        monitoring: false,
        noIntervention: false,
      })
      .then(() => this.rebootClusterNode(nodeId));
  }

  getClusterNodePowerId(nodeId) {
    return this.$http
      .get(`/dedicated/server/${nodeId}/boot?bootType=power`)
      .then(({ data }) => data[0]);
  }

  updateClusterNodePowerStateOff(nodeId) {
    return this.getClusterNodePowerId(nodeId)
      .then((powerId) =>
        this.$http.put(`/dedicated/server/${nodeId}`, {
          bootId: powerId,
          monitoring: false,
          noIntervention: false,
        }),
      )
      .then(() => this.rebootClusterNode(nodeId));
  }

  rebootClusterNode(nodeId) {
    return this.$http.post(`/dedicated/server/${nodeId}/reboot`);
  }

  installClusterNode(clusterId, nodeId, options) {
    return this.$http.put(
      `/nutanix/${clusterId}/nodes/${nodeId}/deploy`,
      options,
    );
  }

  reinstallClusterNode(clusterId, nodeId, options) {
    return this.$http.put(`/nutanix/${clusterId}/nodes/${nodeId}`, options);
  }

  uninstallClusterNode(clusterId, nodeId) {
    return this.$http.post(`/nutanix/${clusterId}/nodes/${nodeId}/terminate`);
  }
}
