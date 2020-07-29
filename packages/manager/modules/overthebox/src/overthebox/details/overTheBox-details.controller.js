import angular from 'angular';
import isArray from 'lodash/isArray';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';
import 'moment';

export default class OverTheBoxDetailsCtrl {
  /* @ngInject */
  constructor(
    $filter,
    $translate,
    $q,
    OVER_THE_BOX,
    OVERTHEBOX_DETAILS,
    OvhApiOverTheBox,
    OvhApiIp,
    OvhApiIpReverse,
    OverTheBoxGraphService,
    TucToast,
    TucChartjsFactory,
  ) {
    this.$filter = $filter;
    this.$translate = $translate;
    this.$q = $q;
    this.OVER_THE_BOX = OVER_THE_BOX;
    this.OVERTHEBOX_DETAILS = OVERTHEBOX_DETAILS;
    this.OvhApiOverTheBox = OvhApiOverTheBox;
    this.OvhApiIp = OvhApiIp;
    this.OvhApiIpReverse = OvhApiIpReverse;
    this.OverTheBoxGraphService = OverTheBoxGraphService;
    this.TucToast = TucToast;
    this.TucChartjsFactory = TucChartjsFactory;
  }

  $onInit() {
    this.loaders = {
      init: true,
      checking: false,
      device: false,
      graph: false,
    };

    this.error = {
      checking: null,
      noDeviceLinked: false,
    };

    this.nameEditable = false;

    this.deviceIds = [];
    this.allDevices = [];
    this.device = null;

    this.$q
      .all([
        this.getServiceInfos(),
        this.checkDevices(),
        this.getDevice(),
        this.getTasks(),
        this.OvhApiOverTheBox.v6()
          .get({
            serviceName: this.serviceName,
          })
          .$promise.then((otb) => {
            this.nameEditable = otb.status === 'active';
            this.releaseChannel = otb.releaseChannel;
            return otb;
          }),
      ])
      .finally(() => {
        if (this.allDevices.length === 1 && !this.device) {
          this.deviceIdToLink = this.allDevices[0].deviceId;
        }
        this.loaders.init = false;
        this.getGraphData();
      });
    this.getAvailableReleaseChannels();
    this.getAvailableAction();
  }

  /**
   * Callback used to display Y scale
   * @param {String} label Current scale label
   * @param {Number} index Index of the current scale label
   * @param  {Array} all   All scale labels
   * @return {String} Label
   */
  humanizeAxisDisplay(label, index, all) {
    const interval = Math.round(all.length / 4);
    if (index === all.length - 1 || index % interval === 0) {
      return this.$filter('tuc-unit-humanize')(label, 'generic', 1);
    }
    return '';
  }

  /**
   * Define the display string for a bitrate
   * @param {Number} bitrate Bitrate in bits per seconds
   * @return {String}
   */
  displayBitrate(bitrate) {
    return this.$filter('tuc-unit-humanize')(bitrate, 'bit', 1);
  }

  /**
   * GetAvailable remote actions
   * @returns {Promise}
   */
  getAvailableAction() {
    this.availableAction = {};
    return this.OvhApiOverTheBox.v6()
      .getAvailableActions({
        serviceName: this.serviceName,
      })
      .$promise.then((actions) => {
        actions.forEach((action) => {
          this.availableAction[action.name] = true;
        });
      });
  }

  /**
   * Compute current max
   * @param series
   * @returns {{max: number, current: number, rateMbps: number, rateUnit: string}}
   */
  static computeSpeed(series) {
    let max = 0;
    let currentMax = 0;
    let rateUnit = 'Mbps';
    let rate = 0;
    if (isArray(series) && series.length && series[0].dps) {
      Object.keys(series[0].dps).forEach((timeStmp) => {
        currentMax = 0;
        for (let i = 0; i < series.length; i += 1) {
          currentMax += series[i].dps[timeStmp];
        }
        max = max > currentMax ? max : currentMax;
      });
      rate = Math.round(currentMax / 104857.6) / 10;
      if (!rate) {
        rate = Math.round(currentMax / 102.4) / 10;
        rateUnit = 'Kbps';
      }
    }

    return {
      max,
      current: currentMax,
      display: {
        value: rate,
        unit: rateUnit,
      },
    };
  }

  static makeGraphPositive(graph) {
    forEach(Object.keys(graph.dps), (key) => {
      // eslint-disable-next-line no-param-reassign
      graph.dps[key] = graph.dps[key] < 0 ? 0 : graph.dps[key];
    });
  }

  /**
   * Load graph data
   */
  getGraphData() {
    if (!this.service) {
      return;
    }

    this.loaders.graph = true;
    this.$q
      .all([
        this.OverTheBoxGraphService.getGraphData({
          service: this.service,
          downSample: this.OVER_THE_BOX.statistics.sampleRate,
          direction: 'in',
        }),
        this.OverTheBoxGraphService.getGraphData({
          service: this.service,
          downSample: this.OVER_THE_BOX.statistics.sampleRate,
          direction: 'out',
        }),
      ])
      .then((data) => {
        const inData = data[0] && data[0].data ? data[0].data : [];
        const outData = data[1] && data[1].data ? data[1].data : [];

        const filteredDown = inData.filter(
          (d) => this.kpiInterfaces.indexOf(d.tags.iface) > -1,
        );

        forEach(filteredDown, this.constructor.makeGraphPositive);
        this.download = this.constructor.computeSpeed(filteredDown);

        const filteredUp = outData.filter(
          (d) => this.kpiInterfaces.indexOf(d.tags.iface) > -1,
        );
        forEach(filteredUp, this.constructor.makeGraphPositive);
        this.upload = this.constructor.computeSpeed(filteredUp);

        // Download chart
        this.chartDown = new this.TucChartjsFactory(
          angular.copy(this.OVERTHEBOX_DETAILS.chart),
        );
        this.chartDown.setYLabel(
          this.$translate.instant('overTheBox_statistics_bits_per_sec_legend'),
        );
        this.chartDown.setAxisOptions('yAxes', {
          ticks: {
            callback: this.humanizeAxisDisplay.bind(this),
          },
        });
        this.chartDown.setTooltipCallback('label', (item) =>
          this.displayBitrate(item.yLabel),
        );

        const downSeries = sortBy(
          map(filteredDown, (d) => ({
            name: d.tags.iface,
            data: Object.keys(d.dps).map((key) => ({
              x: key * 1000,
              y: d.dps[key] * 8,
            })),
          })),
          ['name'],
        );

        forEach(downSeries, (serie) => {
          this.chartDown.addSerie(serie.name, serie.data, {
            dataset: {
              fill: true,
              borderWidth: 1,
            },
          });
        });
        if (!downSeries.length) {
          this.chartDown.options.scales.xAxes = [];
        }

        // Upload chart
        this.chartUp = new this.TucChartjsFactory(
          angular.copy(this.OVERTHEBOX_DETAILS.chart),
        );
        this.chartUp.setYLabel(
          this.$translate.instant('overTheBox_statistics_bits_per_sec_legend'),
        );
        this.chartUp.setAxisOptions('yAxes', {
          ticks: {
            callback: this.humanizeAxisDisplay.bind(this),
          },
        });
        this.chartUp.setTooltipCallback('label', (item) =>
          this.displayBitrate(item.yLabel),
        );

        const upSeries = sortBy(
          map(filteredUp, (d) => ({
            name: d.tags.iface,
            data: Object.keys(d.dps).map((key) => ({
              x: key * 1000,
              y: d.dps[key] * 8,
            })),
          })),
          ['name'],
        );

        forEach(upSeries, (serie) => {
          this.chartUp.addSerie(serie.name, serie.data, {
            dataset: {
              fill: true,
              borderWidth: 1,
            },
          });
        });
        if (!upSeries.length) {
          this.chartUp.options.scales.xAxes = [];
        }
      })
      .catch((err) => {
        this.TucToast.error(
          this.$translate.instant('overthebox_traffic_error'),
        );
        this.$q.reject(err);
      })
      .finally(() => {
        this.loaders.graph = false;
      });
  }

  /**
   * Get available release channels
   * @returns {Promise}
   */
  getAvailableReleaseChannels() {
    this.releaseChannels = [];
    return this.OvhApiOverTheBox.v6()
      .getAvailableReleaseChannels({
        serviceName: this.serviceName,
      })
      .$promise.then((channels) => {
        this.releaseChannels = channels.map((channel) => ({
          name: channel,
          label: this.$translate.instant(
            `overTheBox_release_channel_${channel}`,
          ),
        }));

        const result = this.releaseChannels.find(
          (channel) => this.releaseChannel === channel.name,
        );

        if (result) {
          this.releaseChannel = this.$translate.instant(
            `overTheBox_release_channel_${this.releaseChannel}`,
          );
        }
      });
  }

  /**
   * Launch remote action to the NUC
   * @param {String} actionName Action to launch
   * @returns {Promise}
   */
  LaunchAction(actionName) {
    this.availableAction = {};
    return this.OvhApiOverTheBox.v6()
      .launchAction(
        {
          serviceName: this.serviceName,
        },
        {
          name: actionName,
        },
      )
      .$promise.then((data) => {
        this.TucToast.success(
          this.$translate.instant('overTheBox_action_launch_success'),
        );
        return data;
      })
      .catch((err) => {
        this.TucToast.error(
          this.$translate.instant('overTheBox_action_launch_error'),
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.getAvailableAction();
      });
  }

  /**
   * Load Service info
   */
  getServiceInfos() {
    this.loaders.infos = true;
    return this.OvhApiOverTheBox.v6()
      .getServiceInfos({ serviceName: this.serviceName })
      .$promise.then((serviceInfos) => {
        this.serviceInfos = serviceInfos;
        if (this.serviceInfos && this.serviceInfos.renew) {
          this.serviceInfos.renew.undoDeleteAtExpiration = this.serviceInfos.renew.deleteAtExpiration;
        }
        return serviceInfos;
      })
      .catch((error) => {
        this.error.tasks = error.data;
        this.TucToast.error(
          [
            this.$translate.instant('an_error_occured'),
            error.data.message,
          ].join(' '),
        );
        return this.$q.reject(error);
      })
      .finally(() => {
        this.loaders.infos = false;
      });
  }

  /**
   * Load Tasks
   */
  getTasks() {
    this.loaders.tasks = true;
    return this.OvhApiOverTheBox.v6()
      .getTasks({
        serviceName: this.serviceName,
      })
      .$promise.then((tasks) => {
        this.tasks = tasks;
        return tasks;
      })
      .catch((error) => {
        this.error.tasks = error.data;
        this.TucToast.error(
          [
            this.$translate.instant('an_error_occured'),
            error.data.message,
          ].join(' '),
        );
        return this.$q.reject(error);
      })
      .finally(() => {
        this.loaders.tasks = false;
      });
  }

  /**
   * Check devices
   */
  checkDevices() {
    this.loaders.checking = true;
    return this.OvhApiOverTheBox.v6()
      .checkDevices()
      .$promise.then((devices) => {
        this.allDevices = devices;
        this.deviceIds = devices.map((device) => device.deviceId);
        return this.deviceIds;
      })
      .catch((error) => {
        this.error.checking = error.data;
        this.TucToast.error(
          [
            this.$translate.instant('an_error_occured'),
            error.data.message,
          ].join(' '),
        );
        return this.$q.reject(error);
      })
      .finally(() => {
        this.loaders.checking = false;
      });
  }

  /**
   * Get connected devices
   */
  getDevice() {
    this.loaders.device = true;
    return this.OvhApiOverTheBox.v6()
      .getDevice({
        serviceName: this.serviceName,
      })
      .$promise.then((devices) => {
        this.device = devices;
        this.kpiInterfaces = devices.networkInterfaces
          .filter((netInterface) => netInterface.gateway != null)
          .map((netInterface) =>
            netInterface.device ? netInterface.device : netInterface.name,
          );

        this.getLastSeen();

        this.checkPublicIP();

        if (this.device && this.device.publicIp) {
          this.getReverseDNS();
        }
        return devices;
      })
      .catch((error) => {
        if (error.status === 404) {
          this.error.noDeviceLinked = true;
        }
        return this.$q.reject(error);
      })
      .finally(() => {
        this.loaders.device = false;
      });
  }

  /**
   * Get last seen values
   */
  getLastSeen() {
    if (this.device && this.device.lastSeen) {
      // check lastSeen access is less than 5 minutes
      const currentDate = moment();
      const lastSeen = moment(this.device.lastSeen);
      const diffDate = currentDate.diff(lastSeen, 'minute');

      this.lastSeenAccess = {
        lastSeen: diffDate,
        lastSeenHuman: moment.duration(currentDate.diff(lastSeen)).humanize(),
      };

      if (diffDate < this.OVERTHEBOX_DETAILS.lastSeen.limit) {
        this.lastSeenAccess.isRecent = true;
      } else {
        this.lastSeenAccess.isRecent = false;
      }
    }
  }

  /**
   * Check public IP to retrieve its status
   */
  checkPublicIP() {
    return this.OvhApiIp.v6()
      .query({
        'routedTo.serviceName': this.serviceName,
        type: 'overthebox',
      })
      .$promise.then((ips) => {
        const [ip] = ips;

        if (!ip) {
          this.serviceIP = {
            status: this.OVERTHEBOX_DETAILS.serviceIpStatus.unknown,
          };
        } else if (this.device && this.device.publicIp) {
          if (ip.includes(this.device.publicIp)) {
            this.serviceIP = {
              status: this.OVERTHEBOX_DETAILS.serviceIpStatus.locked,
            };
          } else {
            this.serviceIP = {
              status: this.OVERTHEBOX_DETAILS.serviceIpStatus.warning,
            };
          }
        } else {
          this.serviceIP = {
            status: this.OVERTHEBOX_DETAILS.serviceIpStatus.unknown,
          };
        }
        return ips;
      })
      .catch((error) => {
        this.error.checking = error.data;
        this.TucToast.error(
          [
            this.$translate.instant('an_error_occured'),
            error.data.message,
          ].join(' '),
        );
        return this.$q.reject(error);
      });
  }

  /**
   * Retrieve reverse DNS from public IP
   */
  getReverseDNS() {
    return this.OvhApiIpReverse.v6()
      .getReverseDns(this.device.publicIp)
      .then((dns) => {
        set(this.device, 'reverse', dns);
        return dns;
      })
      .catch(() => this.$q.when(null));
  }

  /**
   * Link a device
   * @param {Object} device Device to link
   */
  linkDevice(device) {
    this.loaders.device = true;
    return this.OvhApiOverTheBox.v6()
      .linkDevice(
        {
          serviceName: this.serviceName,
        },
        {
          deviceId: device.deviceId,
        },
      )
      .$promise.then(() => {
        this.device = device;
        this.TucToast.success(
          this.$translate.instant('overTheBox_link_device_success'),
        );
        return device;
      })
      .catch((error) => {
        this.TucToast.error(
          [
            this.$translate.instant('an_error_occured'),
            error.data.message,
          ].join(' '),
        );
        return this.$q.reject(error);
      })
      .finally(() => {
        this.loaders.device = false;
      });
  }

  /**
   * check if Service can be resiliated
   * @return {Boolean}
   */
  canResiliate() {
    if (!this.serviceInfos || !this.serviceInfos.renew) {
      return false;
    }
    return (
      !this.serviceInfos.renew.deleteAtExpiration &&
      !this.serviceInfos.undoDeleteAtExpiration &&
      this.serviceInfos.canDeleteAtExpiration
    );
  }

  /**
   * Check if an on-going resiliation can be cancelled
   * @return {Boolean}
   */
  canCancelResiliation() {
    if (this.canResiliate()) {
      return false;
    }
    if (!this.serviceInfos || !this.serviceInfos.renew) {
      return false;
    }
    return (
      this.serviceInfos.renew.deleteAtExpiration &&
      !this.serviceInfos.undoDeleteAtExpiration
    );
  }

  /**
   * Resiliate the current service
   * @return {Promise}
   */
  resiliate() {
    this.loaders.resiliating = true;
    return this.OvhApiOverTheBox.v6()
      .deleteAtExpiration(
        {
          serviceName: this.serviceName,
        },
        null,
      )
      .$promise.then(this.getServiceInfos)
      .then((data) => {
        this.TucToast.success(
          this.$translate.instant('overTheBox_resiliation_success', {
            service:
              this.service.customerDescription || this.service.serviceName,
            date: moment(this.serviceInfos.expiration).format('DD/MM/YYYY'),
          }),
        );
        return data;
      })
      .catch((err) => {
        this.TucToast.error(
          this.$translate.instant('overTheBox_resiliation_error', {
            service:
              this.service.customerDescription || this.service.serviceName,
          }),
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.loaders.resiliating = false;
      });
  }

  /**
   * Cancel the resiliation of the current service
   * @return {Promise}
   */
  cancelResiliation() {
    this.loaders.cancellingResiliation = true;
    return this.OvhApiOverTheBox.v6()
      .keepAtExpiration(
        {
          serviceName: this.serviceName,
        },
        null,
      )
      .$promise.then(this.getServiceInfos)
      .then((data) => {
        this.TucToast.success(
          this.$translate.instant('overTheBox_cancel_resiliation_success', {
            service:
              this.service.customerDescription || this.service.serviceName,
          }),
        );
        return data;
      })
      .catch((err) => {
        this.TucToast.error(
          this.$translate.instant('overTheBox_resiliation_cancel_error', {
            service:
              this.service.customerDescription || this.service.serviceName,
          }),
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.loaders.cancellingResiliation = false;
      });
  }

  changeReleaseChannel(channel) {
    this.loaders.changingReleaseChannel = true;
    return this.OvhApiOverTheBox.v6()
      .putService(
        {
          serviceName: this.serviceName,
        },
        {
          releaseChannel: channel.name,
        },
      )
      .$promise.then(() => {
        this.TucToast.success(
          this.$translate.instant('overTheBox_change_release_channel_success'),
        );
      })
      .catch((err) => {
        this.TucToast.error(
          this.$translate.instant('overTheBox_change_release_channel_error', {
            errorMessage: err.data.message,
          }),
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.loaders.changingReleaseChannel = false;
      });
  }
}
