import map from 'lodash/map';
import { BillingService, DedicatedServer } from '@ovh-ux/manager-models';
import { NOT_SUBSCRIBED, SERVER_OPTIONS } from './constants';
import Cluster from '../cluster.class';

export default class NutanixService {
  /* @ngInject */
  constructor($q, $http) {
    this.$q = $q;
    this.$http = $http;
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
}
