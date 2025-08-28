import compact from 'lodash/compact';
import filter from 'lodash/filter';
import find from 'lodash/find';
import head from 'lodash/head';
import map from 'lodash/map';
import parseInt from 'lodash/parseInt';
import set from 'lodash/set';
import snakeCase from 'lodash/snakeCase';
import uniq from 'lodash/uniq';

export default class Server {
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
    icebergUtils,
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
    this.icebergUtils = icebergUtils;

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

  getTasks(serviceName, paginationParams = {}, urlParams = {}) {
    return this.icebergUtils.icebergQuery(
      `/dedicated/server/${serviceName}/task`,
      paginationParams,
      urlParams,
    );
  }

  static getTaskPath(productId, taskId) {
    return `apiv6/dedicated/server/${productId}/task/${taskId}`;
  }

  addTaskFast(productId, task, scopeId) {
    set(task, 'id', task.id || task.taskId);
    const pollPromise = this.$q.defer();

    this.Polling.addTaskFast(
      Server.getTaskPath(productId, task.id),
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
      Server.getTaskPath(productId, task.id || task.taskId),
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

  getFtpBackupFeatures(serviceName) {
    return this.OvhHttp.get(
      '/dedicated/server/{serviceName}/features/backupFTP',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      },
    ).catch(() => {
      return null;
    });
  }

  getOrder(serviceName) {
    return this.OvhHttp.get('/order/dedicated/server/{serviceName}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    }).catch(() => {
      return null;
    });
  }

  getFtpBackup(serviceName) {
    return this.$q
      .all({
        backupFtp: this.getFtpBackupFeatures(serviceName),
        order: this.getOrder(serviceName),
      })
      .then(({ backupFtp, order }) => {
        return {
          activated: !!backupFtp,
          login: serviceName,
          canOrder: order?.includes('backupStorage') || false,
          quota: backupFtp?.quota,
          usage: backupFtp?.usage,
          activate: !!backupFtp,
          typeBackup: backupFtp?.type?.toUpperCase(),
          name: backupFtp?.ftpBackupName,
        };
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

    response.download.values = Server.fillGaps(arrayIn[0].data);
    response.upload.values = Server.fillGaps(arrayIn[1].data);
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
          const pointInterval = Server.getPointInterval(period);
          return Server.buildMRTGResponse(results, pointInterval);
        }),
    );
  }

  getStatistics(productId, mac, type, period) {
    this.resetCache();
    return this.aggregateMRTG(productId, mac, type, period);
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

  getOvhTemplates(serviceName) {
    return this.OvhHttp.get(
      '/sws/dedicated/server/{serviceName}/installation/templates',
      {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
      },
    );
  }

  getPersonalTemplatesList() {
    // temporary, to be removed with all its dependencies starting from 7th of October 2025
    return this.OvhHttp.get('/me/installationTemplate', {
      rootPath: 'apiv6',
    });
  }

  getPartitionSchemes(productId, templateName) {
    return this.get(productId, '{templateName}/partitionScheme', {
      urlParams: {
        templateName,
      },
      proxypass: true,
      urlPath: this.path.installationMe,
    });
  }

  getPartitionSchemePriority(productId, templateName, schemeName) {
    return this.get(productId, '{templateName}/partitionScheme/{schemeName}', {
      urlParams: {
        templateName,
        schemeName,
      },
      proxypass: true,
      urlPath: this.path.installationMe,
    });
  }

  getOvhPartitionSchemesTemplatesDetail(template, partitionScheme) {
    return this.OvhHttp.get(
      '/sws/dedicated/server/installationTemplate/{template}/{partitionScheme}/partitions',
      {
        rootPath: '2api',
        urlParams: {
          template,
          partitionScheme,
        },
      },
    );
  }

  startInstallation(
    serviceName,
    operatingSystem,
    storage = {},
    customizations = {},
  ) {
    return this.OvhHttp.post('/dedicated/server/{serviceName}/reinstall', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data: {
        operatingSystem,
        storage,
        customizations,
      },
    });
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
      if (err.status === 460 || err.status === 500) {
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

  static getIntervalUnit(duration) {
    switch (duration.slice(-1)) {
      case 'h': {
        return 'hour';
      }
      case 'Y': {
        return 'year';
      }
      default: {
        return 'month';
      }
    }
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
          prices: plan.prices.map((price) => {
            if (price.capacities.includes('renew')) {
              return {
                ...price,
                intervalUnit: Server.getIntervalUnit(price.duration),
              };
            }
            return price;
          }),
        };
      }
      return null;
    });

    return compact(list);
  }

  getBareMetalPublicBandwidthOptions(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/upgrade`)
      .then(({ data }) => data);
  }

  getBareMetalPublicBandwidthOrder(serviceId, planCode, params) {
    return this.$http
      .post(`/services/${serviceId}/upgrade/${planCode}/simulate`, params)
      .then(({ data }) => data);
  }

  bareMetalPublicBandwidthPlaceOrder(serviceId, planCode, params) {
    return this.$http
      .post(`/services/${serviceId}/upgrade/${planCode}/execute`, params)
      .then(({ data }) => data);
  }

  getHardwareSpecifications(productId) {
    return this.get(productId, 'specifications/hardware', {
      proxypass: true,
    });
  }

  getUsbStorageInformations(server) {
    let orderable;
    if (!server.canOrderUsbDisk) {
      orderable = this.$q.resolve(null);
    } else {
      orderable = this.get(server.name, 'orderable/usbKey', {
        proxypass: true,
      });
    }

    const specification = this.get(server.name, 'specifications/hardware', {
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

  getModels() {
    return this.$http.get('apiv6/dedicated/server.json', { cache: true });
  }

  getModel(key) {
    return this.getModels().then(({ data }) => {
      const { models } = data;
      if (!models[key]) {
        throw new Error(`Model '${key}' not found`);
      }
      return models[key];
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

  getHardwareRaidProfile(serviceName) {
    return this.getSelected(serviceName).then((selectedServer) =>
      this.$http
        .get(
          `apiv6/dedicated/server/${selectedServer.name}/install/hardwareRaidProfile`,
        )
        .then((results) => results.data),
    );
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
        const plan = plans.find(
          (currentPlan) =>
            currentPlan.planCode.startsWith(planName) ||
            currentPlan.invoiceName === planName,
        );
        if (!plan) return '';
        const cpu = find(products, { name: plan.product });
        const memoryPlan = find(plan.addonFamilies, { name: 'memory' });
        const memory = find(addons, { planCode: memoryPlan.default });

        return `${cpu.description}, ${memory.invoiceName}`;
      });
  }

  getServices() {
    return this.$http.get('/service', {
      params: {
        external: false,
        type: '/dedicated/server',
      },
      serviceType: 'aapi',
      headers: {
        pragma: 'no-cache',
      },
    });
  }
}
