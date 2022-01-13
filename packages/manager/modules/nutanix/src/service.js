import map from 'lodash/map';
import { BillingService, DedicatedServer } from '@ovh-ux/manager-models';
import { NOT_SUBSCRIBED, SERVER_OPTIONS } from './constants';
import Cluster from './cluster.class';

export default class NutanixService {
  /* @ngInject */
  constructor($q, $http, iceberg) {
    this.$q = $q;
    this.$http = $http;
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

  getServiceInfo(serviceName) {
    return this.$http
      .get(`/nutanix/${serviceName}/serviceInfos`)
      .then(({ data }) => new BillingService(data));
  }

  getServiceDetails(serviceId) {
    return this.$http.get(`/service/${serviceId}`).then(({ data }) => data);
  }

  getServicesDetails(serviceId) {
    return this.$http.get(`/services/${serviceId}`).then(({ data }) => data);
  }

  getNodeHardwareInfo(nodeId) {
    return this.$http
      .get(`/dedicated/technical-details/${nodeId}`, {
        serviceType: 'aapi',
      })
      .then(({ data }) =>
        data?.baremetalServers?.storage ? data?.baremetalServers : null,
      )
      .catch(() => null);
  }

  getClusterHardwareInfo(serviceId, nodeServiceId) {
    return this.getClusterOptions(serviceId)
      .then((options) => {
        const allOptions = [
          ...options,
          {
            serviceId: nodeServiceId,
          },
        ];
        return this.$q.all(
          allOptions.map((option) => {
            return this.getHardwareInfo(option.serviceId).then(
              (hardwareInfo) => {
                return {
                  ...hardwareInfo,
                  serviceId: option.serviceId,
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
    });
    return baremetalServers;
  }

  getClusterOptions(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/options`)
      .then(({ data }) => data);
  }

  getHardwareInfo(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/technicalDetails`)
      .then(({ data }) => data);
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
      .get(`dedicated/server/${productId}/orderable/${optionName}`)
      .catch((err) => {
        if (err.status === 460 || err.status === 400) {
          return {};
        }
        return this.$q.reject(err);
      });
  }

  transformOrderableBandwidths(bandwidths) {
    return map(bandwidths, (bandwidth) => ({
      value: bandwidth,
      unit: 'mbps',
      text: this.$translate.instant('unit_gbps', {
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
}
