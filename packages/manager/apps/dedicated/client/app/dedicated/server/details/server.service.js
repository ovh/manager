import compact from 'lodash/compact';
import filter from 'lodash/filter';
import find from 'lodash/find';
import head from 'lodash/head';
import map from 'lodash/map';
import parseInt from 'lodash/parseInt';
import set from 'lodash/set';
import snakeCase from 'lodash/snakeCase';
import uniq from 'lodash/uniq';

export default class ServerF {
  /* @ngInject */
  constructor(
    $cacheFactory,
    $http,
    $q,
    $rootScope,
    $translate,
    constants,
    coreConfig,
    OvhApiOrder,
    OvhApiOrderCatalogPublic,
    OvhHttp,
    Polling,
    WucApi,
  ) {
    this.$cacheFactory = $cacheFactory;
    this.$http = $http;
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.constants = constants;
    this.coreConfig = coreConfig;
    this.OvhApiOrder = OvhApiOrder;
    this.OvhApiOrderCatalogPublic = OvhApiOrderCatalogPublic;
    this.OvhHttp = OvhHttp;
    this.Polling = Polling;
    this.WucApi = WucApi;

    this.OvhApiOrderBaremetalPublicBW = OvhApiOrder.Upgrade()
      .BaremetalPublicBandwidth()
      .v6();
    this.OvhApiOrderBaremetalPrivateBW = OvhApiOrder.Upgrade()
      .BaremetalPrivateBandwidth()
      .v6();

    this.serverCaches = {
      ipmi: $cacheFactory('UNIVERS_DEDICATED_SERVER_IPMI'),
      ovhTemplates: $cacheFactory(
        'UNIVERS_DEDICATED_SERVER_INSTALLATION_OVH_TEMPLATE',
      ),
    };

    this.requests = {
      serverDetails: null,
      serverStatistics: null,
      serverStatisticsConst: null,
    };

    this.path = {
      product: 'dedicated/server/{serviceName}',
      blocks: 'module/ip/blocks',
      installation: 'installation',
      installationMe: 'me/installationTemplate',
      ip: 'ip',
      sshMe: 'me/sshKey',
      order: 'order/dedicated/server/{serviceName}',
      sms: 'sms',
      proxy: 'apiv6',
      dedicatedServer: 'apiv6/dedicated/server',
    };

    this.serverCache = $cacheFactory('UNIVERS_DEDICATED_SERVER_');

    /**
     * Specific API wrapper (this.<get|put|post|delete>), @see 'WucApi' service.
     * Extra params:
     *   broadcast, forceRefresh
     */
    angular.forEach(['get', 'put', 'post', 'delete'], (operationType) => {
      this[operationType] = function buildOperation(productId, url, _opt) {
        const opt = _opt || {};

        if (opt.forceRefresh) {
          this.resetCache(opt.cache);
        }

        if (!productId) {
          return $q.reject(productId);
        }

        const urlPath = URI.expand(
          (!opt.urlPath && this.path.product) || opt.urlPath,
          {
            serviceName: productId,
          },
        ).toString();
        const fullUrl = ['apiv6', urlPath];

        const params = angular.extend(
          {
            cache: operationType === 'get' ? opt.cache : false, // [TRICK] Force no cache for POST|PUT|DELETE
          },
          opt,
        );

        // Because Play dislike URL finished by a slash...
        return WucApi[operationType](
          url ? fullUrl.concat(url).join('/') : fullUrl.join('/'),
          params,
        )
          .then((response) => {
            if (opt.cache && operationType !== 'get') {
              // [TRICK] Force refresh of datas when POST|PUT|DELETE
              this.resetCache(opt.cache);
            }

            if (opt.broadcast) {
              if (opt.broadcastParam) {
                $rootScope.$broadcast(opt.broadcast, opt.broadcastParam);
              } else {
                $rootScope.$broadcast(opt.broadcast, response);
              }
            }
            return response;
          })
          .catch((response) => $q.reject(response));
      };
    });
  }

  resetCache(targetedCache) {
    if (targetedCache && targetedCache !== this.serverCaches.all) {
      targetedCache.removeAll();
    } else {
      angular.forEach(this.serverCaches, (_cache) => {
        _cache.removeAll();
      });

      this.serverCache.removeAll();

      // eslint-disable-next-line no-restricted-syntax
      for (const request in this.requests) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.requests.hasOwnProperty(request)) {
          this.requests[request] = null;
        }
      }
    }
  }

  getUrlRenew(productId) {
    return this.$q.when(
      URI.expand(this.constants.renew, {
        serviceName: productId,
      }).toString(),
    );
  }

  static getTaskPath(productId, taskId) {
    return `apiv6/dedicated/server/${productId}/task/${taskId}`;
  }

  addTaskFast(productId, task, scopeId) {
    set(task, 'id', task.id || task.taskId);
    const pollPromise = this.$q.defer();

    this.Polling.addTaskFast(
      ServerF.getTaskPath(productId, task.id),
      task,
      scopeId,
    )
      .then((state) => {
        pollPromise.resolve(state);
        if (this.Polling.isDone(state)) {
          this.$rootScope.$broadcast('tasks.update');
        }
      })
      .catch((data) => {
        pollPromise.reject(data);
        this.$rootScope.$broadcast('tasks.update');
      });

    return pollPromise.promise;
  }

  addTask(productId, task, scopeId) {
    const pollPromise = this.$q.defer();

    this.Polling.addTask(
      ServerF.getTaskPath(productId, task.id || task.taskId),
      task,
      scopeId,
    )
      .then((state) => {
        pollPromise.resolve(state);
        if (this.Polling.isDone(state)) {
          this.$rootScope.$broadcast('tasks.update');
        }
      })
      .catch((data) => {
        pollPromise.reject({ type: 'ERROR', message: data.comment });
        this.$rootScope.$broadcast('tasks.update');
      });

    return pollPromise.promise;
  }

  getSelected(serviceName) {
    return this.OvhHttp.get('/sws/dedicated/server/{serviceName}', {
      rootPath: '2api',
      urlParams: {
        serviceName,
      },
      broadcast: 'dedicated.server.refreshTabs',
    });
  }

  reboot(serviceName) {
    return this.OvhHttp.post('/dedicated/server/{serviceName}/reboot', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      broadcast: 'dedicated.informations.reboot',
    });
  }

  getNetboot(serviceName) {
    return this.OvhHttp.get('/sws/dedicated/server/{serviceName}/netboot', {
      rootPath: '2api',
      urlParams: {
        serviceName,
      },
    });
  }

  setNetBoot(serviceName, bootId, rootDevice) {
    return this.OvhHttp.put('/dedicated/server/{serviceName}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data: {
        bootId,
        rootDevice,
      },
      broadcast: 'dedicated.informations.reload',
    });
  }

  updateMonitoring(serviceName, monitoring, noIntervention) {
    return this.OvhHttp.put('/dedicated/server/{serviceName}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data: {
        monitoring,
        noIntervention,
      },
      broadcast: 'dedicated.informations.reload',
      broadcastParam: {
        monitoring,
        noIntervention,
      },
    });
  }

  getRescueMail(productId) {
    return this.get(productId, '', {
      proxypass: true,
      broadcast: 'dedicated.informations.reload',
    });
  }

  updateRescueMail(productId, bootId, rescueMail) {
    return this.put(productId, '', {
      data: {
        bootId,
        rescueMail,
      },
      proxypass: true,
      broadcast: 'dedicated.informations.reload',
    });
  }

  removeHack(productId) {
    return this.put(productId, '', {
      data: {
        state: 'ok',
      },
      proxypass: true,
      broadcast: 'dedicated.informations.reload',
    });
  }

  updateDisplayName({ serviceId, serviceName, displayName }) {
    return this.OvhHttp.put('/service/{serviceId}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceId,
      },
      data: {
        resource: {
          displayName,
        },
      },
      broadcast: 'global_display_name_change',
      broadcastParam: {
        serviceName,
        displayName,
      },
    });
  }

  updateReverse(productId, serviceName, ip, reverse) {
    return this.post(productId, '{ip}/reverse', {
      urlParams: {
        ip,
      },
      data: {
        ipReverse: ip,
        reverse: punycode.toASCII(reverse),
      },
      broadcast: 'global_display_name_change',
      broadcastParam: {
        serviceName,
        displayName: reverse,
      },
      proxypass: true,
      urlPath: this.path.ip,
    });
  }

  deleteReverse(productId, serviceName, ip) {
    return this.delete(productId, '{ip}/reverse/{ip}', {
      urlParams: {
        ip,
      },
      broadcast: 'global_display_name_change',
      broadcastParam: {
        serviceName,
        displayName: serviceName,
      },
      proxypass: true,
      urlPath: this.path.ip,
    });
  }

  getSecondaryDnsList(serviceName, count, offset) {
    return this.OvhHttp.get(
      '/sws/dedicated/server/{serviceName}/secondaryDNS',
      {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        params: {
          count,
          offset,
        },
      },
    );
  }

  listIps(serviceName) {
    return this.OvhHttp.get('/ip', {
      rootPath: 'apiv6',
      params: {
        'routedTo.serviceName': serviceName,
      },
    });
  }

  addSecondaryDns(serviceName, domain, ip) {
    return this.OvhHttp.post(
      '/dedicated/server/{serviceName}/secondaryDnsDomains',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {
          domain,
          ip,
        },
        broadcast: 'dedicated.secondarydns.reload',
      },
    );
  }

  deleteSecondaryDns(serviceName, domain) {
    return this.OvhHttp.delete(
      '/dedicated/server/{serviceName}/secondaryDnsDomains/{domain}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          domain,
        },
        broadcast: 'dedicated.secondarydns.reload',
      },
    );
  }

  getDomainZoneInformation(productId, domain) {
    return this.get(productId, 'secondaryDnsNameDomainToken', {
      params: {
        domain,
      },
      proxypass: true,
    });
  }

  getFtpBackup(serviceName) {
    return this.OvhHttp.get('/sws/dedicated/server/{serviceName}/backupFtp', {
      rootPath: '2api',
      urlParams: {
        serviceName,
      },
    });
  }

  activateFtpBackup(serviceName) {
    return this.OvhHttp.post(
      '/dedicated/server/{serviceName}/features/backupFTP',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        broadcast: 'dedicated.ftpbackup.active',
      },
    );
  }

  deleteFtpBackup(serviceName) {
    return this.OvhHttp.delete(
      '/dedicated/server/{serviceName}/features/backupFTP',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        broadcast: 'dedicated.ftpbackup.delete',
      },
    );
  }

  requestFtpBackupPassword(serviceName) {
    return this.OvhHttp.post(
      '/dedicated/server/{serviceName}/features/backupFTP/password',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        broadcast: 'dedicated.ftpbackup.password',
      },
    );
  }

  getFtpBackupIp(serviceName, count, offset) {
    return this.OvhHttp.get(
      '/sws/dedicated/server/{serviceName}/backupFtp/access',
      {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        params: {
          count,
          offset,
        },
      },
    );
  }

  getAuthorizableBlocks(serviceName) {
    return this.OvhHttp.get(
      '/sws/dedicated/server/{serviceName}/backupFtp/access/authorizableBlocks',
      {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
      },
    );
  }

  postFtpBackupIp(serviceName, ipBlocksList, ftp, nfs, cifs) {
    return this.OvhHttp.post(
      '/sws/dedicated/server/{serviceName}/backupFtp/access-add',
      {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        data: {
          ipBlocksList,
          ftp,
          nfs,
          cifs,
        },
        broadcast: 'server.ftpBackup.refresh',
      },
    );
  }

  putFtpBackupIp(serviceName, ipBlock, ftp, nfs, cifs) {
    return this.OvhHttp.put(
      '/dedicated/server/{serviceName}/features/backupFTP/access/{ipBlock}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          ipBlock,
        },
        data: {
          ftp,
          nfs,
          cifs,
        },
        broadcast: 'server.ftpBackup.refresh',
      },
    );
  }

  deleteFtpBackupIp(serviceName, ipBlock) {
    return this.OvhHttp.delete(
      '/dedicated/server/{serviceName}/features/backupFTP/access/{ipBlock}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          ipBlock,
        },
      },
    );
  }

  getFtpBackupOrder(serviceName) {
    return this.OvhHttp.get(
      '/sws/dedicated/server/{serviceName}/backupFtp/order',
      {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
      },
    );
  }

  getFtpBackupOrderDetail(serviceName, capacity) {
    return this.OvhHttp.get(
      '/sws/dedicated/server/{serviceName}/backupFtp/order/{capacity}/details',
      {
        rootPath: '2api',
        urlParams: {
          serviceName,
          capacity,
        },
      },
    );
  }

  postFtpBackupOrderDetail(serviceName, duration, capacity) {
    return this.OvhHttp.post(
      '/order/dedicated/server/{serviceName}/backupStorage/{duration}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          duration,
        },
        data: {
          capacity,
        },
        broadcast: 'server.ftpBackup.refresh',
      },
    );
  }

  getStatisticsConst() {
    return this.getModels().then((models) => ({
      types: uniq(
        map(models.data.models['dedicated.server.MrtgTypeEnum'].enum, (type) =>
          type.split(':')[0].toUpperCase(),
        ),
      ),
      defaultType: 'TRAFFIC',
      periods: models.data.models[
        'dedicated.server.MrtgPeriodEnum'
      ].enum.map((period) => snakeCase(period).toUpperCase()),
      defaultPeriod: 'DAILY',
    }));
  }

  getNetworkInterfaces(productId) {
    let serverName = '';

    return this.getSelected(productId)
      .then((server) => {
        serverName = server.name;
        return this.$http.get(
          [
            this.path.dedicatedServer,
            serverName,
            'networkInterfaceController',
          ].join('/'),
        );
      })
      .then((networkInterfaceIds) => {
        const promises = map(networkInterfaceIds.data, (networkInterfaceId) =>
          this.$http
            .get(
              [
                this.path.dedicatedServer,
                serverName,
                'networkInterfaceController',
                networkInterfaceId,
              ].join('/'),
            )
            .then((response) => response.data),
        );
        return this.$q.all(promises);
      })
      .catch((err) => {
        if (err.status === 460) {
          return [];
        }

        return this.$q.reject(err);
      });
  }

  static getPointInterval(period) {
    switch (period) {
      case 'HOURLY': {
        return {
          standardDays: 0,
          standardHours: 0,
          standardMinutes: 1,
          standardSeconds: 60,
          millis: 60000,
        };
      }
      case 'DAILY': {
        return {
          standardDays: 0,
          standardHours: 0,
          standardMinutes: 5,
          standardSeconds: 300,
          millis: 300000,
        };
      }
      case 'WEEKLY': {
        return {
          standardDays: 0,
          standardHours: 0,
          standardMinutes: 30,
          standardSeconds: 1800,
          millis: 1800000,
        };
      }
      case 'MONTHLY': {
        return {
          standardDays: 0,
          standardHours: 2,
          standardMinutes: 120,
          standardSeconds: 7200,
          millis: 7200000,
        };
      }
      case 'YEARLY': {
        return {
          standardDays: 1,
          standardHours: 24,
          standardMinutes: 1440,
          standardSeconds: 86400,
          millis: 86400000,
        };
      }
      default:
        return null;
    }
  }

  static fillGaps(arrayIn) {
    const graph = [];

    arrayIn.forEach((point, index, array) => {
      let value;
      let unit;
      const { timestamp } = point;
      if (point.value === null) {
        const prevPoint = array[index - 1];

        if (!prevPoint || !prevPoint.value) {
          value = 0;
          unit = 'bps';
        } else {
          value = prevPoint.value.value;
          unit = prevPoint.value.unit;
        }
      } else {
        unit = point.value.unit;
        value = point.value.value;
      }
      graph.push({
        timestamp,
        unit,
        y: value,
      });
    });
    return graph;
  }

  static buildMRTGResponse(arrayIn, pointInterval) {
    const response = {
      state: 'OK',
      messages: [],
      upload: {
        pointInterval,
        pointStart: moment(arrayIn[1].data[0].timestamp * 1000).format(),
        values: [],
      },
      download: {
        pointInterval,
        pointStart: moment(arrayIn[0].data[0].timestamp * 1000).format(),
        values: [],
      },
    };

    response.download.values = ServerF.fillGaps(arrayIn[0].data);
    response.upload.values = ServerF.fillGaps(arrayIn[1].data);
    return response;
  }

  aggregateMRTG(productId, mac, type, period) {
    return this.getSelected(productId).then((server) =>
      this.$q
        .all([
          this.$http.get(
            [
              this.path.dedicatedServer,
              server.name,
              'networkInterfaceController',
              mac,
              'mrtg',
            ].join('/'),
            {
              params: {
                period: period.toLowerCase(),
                type: `${type.toLowerCase()}:download`,
              },
            },
          ),
          this.$http.get(
            [
              this.path.dedicatedServer,
              server.name,
              'networkInterfaceController',
              mac,
              'mrtg',
            ].join('/'),
            {
              params: {
                period: period.toLowerCase(),
                type: `${type.toLowerCase()}:upload`,
              },
            },
          ),
        ])
        .then((results) => {
          const pointInterval = ServerF.getPointInterval(period);
          return ServerF.buildMRTGResponse(results, pointInterval);
        }),
    );
  }

  getStatistics(productId, mac, type, period) {
    this.resetCache();
    return this.aggregateMRTG(productId, mac, type, period);
  }

  getInterventions(serviceName, count, offset) {
    return this.OvhHttp.get(
      '/sws/dedicated/server/{serviceName}/interventions',
      {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        params: {
          count,
          offset,
        },
      },
    );
  }

  getTaskInProgress(serviceName, type) {
    return this.OvhHttp.get(
      '/sws/dedicated/server/{serviceName}/tasks/uncompleted',
      {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        params: {
          type,
        },
      },
    );
  }

  hasSqlServerAvailable(productId) {
    return this.get(productId, 'installation/sqlserver', {});
  }

  getSshKey(productId) {
    return this.get(productId, '', {
      proxypass: true,
      urlPath: this.path.sshMe,
    });
  }

  getOrderProUseDuration(productId) {
    return this.get(productId, 'professionalUse', {
      proxypass: true,
      urlPath: this.path.order,
    });
  }

  getOrderProUseOrder(productId, duration) {
    return this.get(productId, 'professionalUse/{duration}', {
      urlPath: this.path.order,
      urlParams: {
        duration,
      },
      proxypass: true,
    });
  }

  orderProUse(productId, duration) {
    return this.post(productId, 'professionalUse/{duration}', {
      urlPath: this.path.order,
      urlParams: {
        duration,
      },
      proxypass: true,
    });
  }

  progressInstallation(serviceName) {
    return this.OvhHttp.get('/dedicated/server/{serviceName}/install/status', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      returnErrorKey: '',
    }).catch((error) => {
      if (error.status === 460) {
        return [];
      }
      return this.$q.reject(error);
    });
  }

  cancelTask(productId, taskId) {
    return this.post(productId, 'task/{taskId}/cancel', {
      urlParams: {
        taskId,
      },
      proxypass: true,
    });
  }

  getBandwidth(productId) {
    return this.get(productId, 'specifications/network', {
      proxypass: true,
    })
      .then((data) => data)
      .catch((err) => {
        if (err.status === 404 || err.status === 460) {
          return {};
        }
        return this.$q.reject(err);
      });
  }

  getBandwidthOption(productId) {
    return this.get(productId, 'option/BANDWIDTH', {
      proxypass: true,
    })
      .then((data) => data.state)
      .catch((response) => {
        if (response.status === 404 || response.status === 460) {
          return 'notSubscribed';
        }
        return this.$q.reject(response);
      });
  }

  getBandwidthVrackOption(productId) {
    return this.get(productId, 'option/BANDWIDTH_VRACK', {
      proxypass: true,
    })
      .then((data) => data.state)
      .catch((response) => {
        if (response.status === 404 || response.status === 460) {
          return 'notSubscribed';
        }
        return this.$q.reject(response);
      });
  }

  orderBandwidth(productId, opt) {
    return this.get(productId, 'bandwidth', {
      urlParams: {
        serviceName: opt.serviceName,
      },
      params: {
        bandwidth: opt.bandwidth,
        type: opt.type,
      },
      urlPath: 'order/dedicated/server/{serviceName}',
      proxypass: true,
    })
      .then((durations) => {
        const promises = [];
        const returnData = [];

        angular.forEach(durations, (v) => {
          promises.push(
            this.get(productId, 'bandwidth/{duration}', {
              urlParams: {
                serviceName: opt.serviceName,
                duration: v,
              },
              params: {
                bandwidth: opt.bandwidth,
                type: opt.type,
              },
              urlPath: 'order/dedicated/server/{serviceName}',
              proxypass: true,
            }).then((details) => {
              returnData.push({
                durations: v,
                details,
              });

              return returnData;
            }),
          );
        });

        return this.$q
          .all(promises)
          .then(() => returnData)
          .catch(() => returnData);
      })
      .catch(() => null);
  }

  getOrderables(productId, optionName) {
    return this.get(productId, `orderable/${optionName}`).catch((err) => {
      if (err.status === 460) {
        return {};
      }

      return this.$q.reject(err);
    });
  }

  getOrderableDurations(productId, data) {
    const dedicatedServerPath = 'order/dedicated/server/{serviceName}';

    return this.get(productId, data.optionName, {
      params: data.params,
      urlPath: dedicatedServerPath,
      proxypass: true,
    }).then((durations) => {
      const returnData = [];
      const promises = map(durations, (duration) =>
        this.get(productId, `${data.optionName}/{duration}`, {
          urlParams: {
            duration,
          },
          params: data.params,
          urlPath: dedicatedServerPath,
          proxypass: true,
        }).then((details) => {
          returnData.push({
            durations: duration,
            details,
          });
        }),
      );

      return this.$q
        .all(promises)
        .then(() => returnData)
        .catch(() => returnData);
    });
  }

  postOptionOrder(productId, data) {
    return this.post(productId, `${data.optionName}/{duration}`, {
      urlParams: {
        duration: data.duration,
      },
      data: data.params,
      urlPath: 'order/dedicated/server/{serviceName}',
      proxypass: true,
    });
  }

  getOption(productId, optionName) {
    return this.get(productId, `option/${optionName}`, {
      proxypass: true,
    })
      .then((data) => data.state)
      .catch((response) => {
        if (response.status === 404) {
          return 'notSubscribed';
        }
        return this.$q.reject(response);
      });
  }

  cancelOption(productId, optionName) {
    return this.delete(productId, `option/${optionName}`, {
      proxypass: true,
    });
  }

  cancelBandwidthOption(productId) {
    return this.delete(productId, 'option/BANDWIDTH', {
      proxypass: true,
    });
  }

  postOrderBandwidth(productId, opt) {
    return this.post(productId, 'bandwidth/{duration}', {
      urlParams: {
        serviceName: opt.serviceName,
        duration: opt.duration,
      },
      data: {
        bandwidth: opt.bandwidth,
        type: opt.type,
      },
      urlPath: 'order/dedicated/server/{serviceName}',
      proxypass: true,
    })
      .then((details) => details)
      .catch(() => null);
  }

  // eslint-disable-next-line class-methods-use-this
  getValidBandwidthPlans(plans) {
    const list = map(plans, (plan) => {
      // Not to include already included plans (existing plan)
      if (!plan.planCode.includes('included')) {
        // Extract bandwidth value from product name
        const bandwidth = parseInt(
          head(filter(plan.productName.split('-'), (ele) => /^\d+$/.test(ele))),
        );
        return {
          ...plan,
          bandwidth,
        };
      }
      return null;
    });

    return compact(list);
  }

  getBareMetalPublicBandwidthOptions(serviceName) {
    return this.OvhApiOrderBaremetalPublicBW.getPublicBandwidthOptions({
      serviceName,
    }).$promise;
  }

  getBareMetalPublicBandwidthOrder(serviceName, planCode) {
    this.OvhApiOrderBaremetalPublicBW.resetCache();
    this.OvhApiOrderBaremetalPublicBW.resetQueryCache();

    return this.OvhApiOrderBaremetalPublicBW.getPublicBandwidthOrder(
      {
        serviceName,
        planCode,
      },
      {
        quantity: 1,
      },
    ).$promise;
  }

  bareMetalPublicBandwidthPlaceOrder(serviceName, planCode, autoPay) {
    return this.OvhApiOrderBaremetalPublicBW.postPublicBandwidthPlaceOrder(
      {
        serviceName,
        planCode,
      },
      {
        quantity: 1,
        autoPayWithPreferredPaymentMethod: autoPay,
      },
    ).$promise;
  }

  getHardwareSpecifications(productId) {
    return this.get(productId, 'specifications/hardware', {
      proxypass: true,
    });
  }

  getUsbStorageInformations(productId) {
    const orderable = this.get(productId, 'orderable/usbKey', {
      proxypass: true,
    });

    const specification = this.get(productId, 'specifications/hardware', {
      proxypass: true,
    });

    return this.$q.all([orderable, specification]);
  }

  getUsbStorageDurations(productId, capacity) {
    return this.get(productId, 'usbKey', {
      urlPath: this.path.order,
      params: {
        capacity,
      },
      proxypass: true,
    });
  }

  getUsbStorageOrder(productId, capacity, duration) {
    return this.get(productId, 'usbKey/{duration}', {
      urlPath: this.path.order,
      urlParams: {
        duration,
      },
      params: {
        capacity,
      },
      proxypass: true,
    });
  }

  orderUsbStorage(productId, capacity, duration) {
    return this.post(productId, 'usbKey/{duration}', {
      urlPath: this.path.order,
      urlParams: {
        duration,
      },
      data: {
        capacity,
      },
      proxypass: true,
    });
  }

  getRtmVersion(serviceName) {
    return this.OvhHttp.get('/dedicated/server/{serviceName}/statistics', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      returnErrorKey: '',
    });
  }

  getOsInformation(productId) {
    return this.get(productId, 'statistics/os', {
      proxypass: true,
    });
  }

  getStatisticsChart(productId, opts) {
    return this.get(productId, 'statistics/chart', {
      proxypass: true,
      params: {
        period: opts.period,
        type: opts.type,
      },
    }).then((results) => {
      const { unit } = results;
      const stats = results.values;
      const points = [];

      angular.forEach(stats, (st) => {
        if (st && st.value) {
          points.push([+st.timestamp * 1000, st.value]);
        } else {
          points.push([+st.timestamp * 1000, 0]);
        }
      });

      return {
        unit,
        points,
      };
    });
  }

  getStatisticsLoadavg(productId, opts) {
    const loadavgList = ['loadavg1', 'loadavg15', 'loadavg5'];
    const deferedObject = this.$q.defer();
    const promises = [];
    const data = {};

    angular.forEach(loadavgList, (loadavg) => {
      promises.push(
        this.getStatisticsChart(productId, {
          period: opts.period,
          type: loadavg,
        }).then((results) => {
          data[loadavg] = results;
        }),
      );
    });

    this.$q
      .all(promises)
      .then(() => {
        deferedObject.resolve(data);
      })
      .catch((rejection) => {
        deferedObject.reject(rejection);
      });

    return deferedObject.promise;
  }

  getMotherBoard(productId) {
    return this.get(productId, 'statistics/motherboard', {
      proxypass: true,
    });
  }

  getCpu(productId) {
    return this.get(productId, 'statistics/cpu', {
      proxypass: true,
    });
  }

  getMemory(productId) {
    return this.get(productId, 'statistics/memory', {
      proxypass: true,
    });
  }

  getInfosServer(productId) {
    const deferredObject = this.$q.defer();
    const promises = [];

    const data = {};

    promises.push(
      this.getMotherBoard(productId)
        .then((results) => {
          data.motherboard = results;
        })
        .catch(() => this.$q.reject({})),
    );

    promises.push(
      this.getCpu(productId)
        .then((results) => {
          data.cpu = results;
        })
        .catch(() => this.$q.reject({})),
    );

    promises.push(
      this.getMemory(productId)
        .then((results) => {
          data.memory = {
            total: 0,
            list: {},
          };

          let total = 0;

          angular.forEach(results, (memory) => {
            if (memory.capacity) {
              total += memory.capacity.value;
              const key = memory.capacity.value + memory.capacity.unit;

              if (data.memory.list[key]) {
                data.memory.list[key].number += 1;
              } else {
                data.memory.list[key] = {
                  value: memory.capacity.value,
                  unit: memory.capacity.unit,
                  number: 1,
                };
              }
            }
          });

          data.memory.totalMemory = total;
        })
        .catch(() => this.$q.reject({})),
    );

    promises.push(
      this.getRtmVersion(productId)
        .then((results) => {
          data.rtmVersion = results;
        })
        .catch(() => this.$q.reject({})),
    );

    promises.push(
      this.getOsInformation(productId)
        .then((results) => {
          data.osInfo = results;
        })
        .catch(() => this.$q.reject({})),
    );

    this.$q
      .all(promises)
      .then(() => {
        deferredObject.resolve(data);
      })
      .catch((rejection) => {
        deferredObject.reject(rejection);
      });

    return deferredObject.promise;
  }

  getDiskCharts(serviceName, period) {
    return this.OvhHttp.get(
      '/sws/dedicated/server/{serviceName}/rtm/partitions/{period}',
      {
        urlParams: {
          serviceName,
          period,
        },
      },
    ).then((result) => {
      const data = {
        unit: result.unit,
        series: [],
      };

      angular.forEach(result.series, (serie) => {
        const dataSerie = {
          points: [],
          name: serie.partition,
        };

        angular.forEach(serie.values, (val) => {
          if (val && angular.isNumber(val.value) && val.value) {
            dataSerie.points.push([+val.timestamp * 1000, val.value]);
          } else {
            dataSerie.points.push([+val.timestamp * 1000, 0]);
          }
        });

        data.series.push(dataSerie);
      });

      return data;
    });
  }

  getLoad(productId) {
    return this.get(productId, 'statistics/load', {
      proxypass: true,
    });
  }

  getRaidInfo(serviceName) {
    return this.OvhHttp.get('/sws/dedicated/server/{serviceName}/rtm/raid', {
      rootPath: '2api',
      urlParams: {
        serviceName,
      },
    });
  }

  getPartitions(serviceName) {
    return this.OvhHttp.get(
      '/sws/dedicated/server/{serviceName}/rtm/partitions',
      {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
      },
    );
  }

  getModels() {
    return this.$http.get('apiv6/dedicated/server.json', { cache: true });
  }

  getAllServiceMonitoring(productId) {
    let promises = [];

    return this.get(productId, 'serviceMonitoring', {
      proxypass: true,
    })
      .then((ids) => {
        promises = ids.map((id) =>
          this.get(productId, 'serviceMonitoring/{monitoringId}', {
            proxypass: true,
            urlParams: {
              monitoringId: id,
            },
          }),
        );

        return this.$q.all(promises);
      })
      .catch((error) => {
        if (error.status === 460) {
          return [];
        }

        return this.$q.reject(error);
      });
  }

  getServiceMonitoringIds(productId) {
    return this.get(productId, 'serviceMonitoring', {
      proxypass: true,
    });
  }

  getServiceMonitoring(productId, monitoringId) {
    return this.get(productId, 'serviceMonitoring/{monitoringId}', {
      proxypass: true,
      urlParams: {
        monitoringId,
      },
    });
  }

  addServiceMonitoring(productId, data) {
    return this.post(productId, 'serviceMonitoring', {
      proxypass: true,
      data,
    });
  }

  updateServiceMonitoring(productId, monitoringId, serviceMonitoring) {
    return this.put(productId, 'serviceMonitoring/{monitoringId}', {
      proxypass: true,
      urlParams: {
        monitoringId,
      },
      data: serviceMonitoring,
    });
  }

  deleteServiceMonitoring(productId, monitoringId) {
    return this.delete(productId, 'serviceMonitoring/{monitoringId}', {
      proxypass: true,
      urlParams: {
        monitoringId,
      },
    });
  }

  getAllServiceMonitoringNotifications(productId, opts) {
    return this.get(
      productId,
      'serviceMonitoring/{monitoringId}/alert/{type}',
      {
        proxypass: true,
        urlParams: {
          monitoringId: opts.monitoringId,
          type: opts.type,
        },
      },
    ).then((ids) => {
      const promises = ids.map((alertId) =>
        this.get(
          productId,
          'serviceMonitoring/{monitoringId}/alert/{type}/{alertId}',
          {
            proxypass: true,
            urlParams: {
              monitoringId: opts.monitoringId,
              type: opts.type,
              alertId,
            },
          },
        ),
      );

      return this.$q.all(promises);
    });
  }

  getServiceMonitoringNotificationsIds(productId, opts) {
    return this.get(
      productId,
      'serviceMonitoring/{monitoringId}/alert/{type}',
      {
        proxypass: true,
        urlParams: {
          monitoringId: opts.monitoringId,
          type: opts.type,
        },
      },
    );
  }

  getServiceMonitoringNotifications(productId, opts) {
    return this.get(
      productId,
      'serviceMonitoring/{monitoringId}/alert/{type}/{alertId}',
      {
        proxypass: true,
        forceRefresh: true,
        urlParams: {
          monitoringId: opts.monitoringId,
          type: opts.type,
          alertId: opts.alertId,
        },
      },
    );
  }

  deleteServiceMonitoringNotifications(productId, opts) {
    return this.delete(
      productId,
      'serviceMonitoring/{monitoringId}/alert/{type}/{alertId}',
      {
        proxypass: true,
        urlParams: {
          monitoringId: opts.monitoringId,
          type: opts.type,
          alertId: opts.alertId,
        },
        broadcast: [
          'server.monitoring.notifications',
          opts.type,
          'reload',
        ].join('.'),
      },
    );
  }

  addServiceMonitoringNotificationEmail(productId, opts) {
    return this.post(
      productId,
      'serviceMonitoring/{monitoringId}/alert/email',
      {
        proxypass: true,
        urlParams: {
          monitoringId: opts.monitoringId,
        },
        data: opts.data,
        broadcast: 'server.monitoring.notifications.email.reload',
      },
    );
  }

  update(productId, opts) {
    return this.put(
      productId,
      'serviceMonitoring/{monitoringId}/alert/email/{alertId}',
      {
        proxypass: true,
        urlParams: {
          monitoringId: opts.monitoringId,
          alertId: opts.alertId,
        },
        data: opts.data,
        broadcast: 'server.monitoring.notifications.email.reload',
      },
    );
  }

  addServiceMonitoringNotificationSMS(productId, opts) {
    return this.post(productId, 'serviceMonitoring/{monitoringId}/alert/sms', {
      proxypass: true,
      urlParams: {
        monitoringId: opts.monitoringId,
      },
      data: opts.data,
      broadcast: 'server.monitoring.notifications.sms.reload',
    });
  }

  updateServiceMonitoringNotificationSMS(productId, opts) {
    return this.put(
      productId,
      'serviceMonitoring/{monitoringId}/alert/sms/{alertId}',
      {
        proxypass: true,
        urlParams: {
          monitoringId: opts.monitoringId,
          alertId: opts.alertId,
        },
        data: opts.data,
        broadcast: 'server.monitoring.notifications.sms.reload',
      },
    );
  }

  getSms(productId) {
    let promises = [];

    if (this.coreConfig.isRegion(['CA', 'US'])) {
      return this.$q.when([]);
    }

    return this.get(productId, '', {
      proxypass: true,
      urlPath: this.path.sms,
    }).then((ids) => {
      promises = ids.map((smsId) =>
        this.get(productId, '{serviceName}', {
          proxypass: true,
          urlPath: this.path.sms,
          urlParams: {
            serviceName: smsId,
          },
        }),
      );

      return this.$q.all(promises);
    });
  }

  terminate(serviceName) {
    return this.OvhHttp.post('/dedicated/server/{serviceName}/terminate', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  }

  getRtmHowtoUrl() {
    let link;
    let lang;

    /* Arbitrary fallback to English */
    const fallbackLang = 'GB';
    const selectedLanguage = this.$translate.use();

    try {
      lang = selectedLanguage.replace(/^\w{2}_/, '').toUpperCase();
    } catch (e) {
      lang = fallbackLang;
      throw e;
    }

    if (
      this.constants.urls &&
      this.constants.urls[lang] &&
      this.constants.urls[lang].RealTimeMonitoring
    ) {
      link = this.constants.urls[lang].RealTimeMonitoring;
    } else {
      link = this.constants.urls[fallbackLang].RealTimeMonitoring;
    }

    return link;
  }

  getVrack(serviceName) {
    return this.getSelected(serviceName).then((selectedServer) =>
      this.$http
        .get(`apiv6/dedicated/server/${selectedServer.name}/vrack`)
        .then((results) => results.data),
    );
  }

  getVrackInfos(serviceName) {
    return this.getVrack(serviceName)
      .then((results) => {
        const promises = results.map((vrack) =>
          this.$http.get(`apiv6/vrack/${vrack}`).then(({ data }) => ({
            serviceName: vrack,
            ...data,
          })),
        );

        return this.$q.all(promises);
      })
      .catch((error) => {
        if (error.status === 404 || error.status === 460) {
          return this.$q.resolve(null);
        }

        return this.$q.reject(error);
      });
  }

  updateServiceInfos(serviceName, data) {
    return this.OvhHttp.put('/dedicated/server/{serviceName}/serviceInfos', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data,
      broadcast: 'dedicated.informations.reload',
    });
  }

  getServiceInfos(serviceName) {
    return this.OvhHttp.get('/dedicated/server/{serviceName}/serviceInfos', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  }

  isAutoRenewable(productId) {
    return this.getSelected(productId).then(
      (server) => moment(server.expiration).diff(moment().date(), 'days') > 0,
    );
  }

  getUpgradeProductName(planName, ovhSubsidiary) {
    return this.OvhApiOrderCatalogPublic.v6()
      .get({
        productName: 'baremetalServers',
        ovhSubsidiary,
      })
      .$promise.then(({ addons, plans, products }) => {
        const plan = find(plans, { invoiceName: planName });
        const cpu = find(products, { name: plan.product });
        const memoryPlan = find(plan.addonFamilies, { name: 'memory' });
        const memory = find(addons, { planCode: memoryPlan.default });

        return `${cpu.description}, ${memory.invoiceName}`;
      });
  }

  getBringYourOwnImage(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/bringYourOwnImage`)
      .then(({ data }) => data);
  }
}
