import assign from 'lodash/assign';
import camelCase from 'lodash/camelCase';
import compact from 'lodash/compact';
import filter from 'lodash/filter';
import find from 'lodash/find';
import head from 'lodash/head';
import indexOf from 'lodash/indexOf';
import map from 'lodash/map';
import parseInt from 'lodash/parseInt';
import set from 'lodash/set';
import snakeCase from 'lodash/snakeCase';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';

angular
  .module('services')
  .constant('SERVERSTATS_PERIOD_ENUM', {
    HOURLY: {
      standardDays: 0,
      standardHours: 0,
      standardMinutes: 1,
      standardSeconds: 60,
      millis: 60000,
    },
    DAILY: {
      standardDays: 0,
      standardHours: 0,
      standardMinutes: 5,
      standardSeconds: 300,
      millis: 300000,
    },
    WEEKLY: {
      standardDays: 0,
      standardHours: 0,
      standardMinutes: 30,
      standardSeconds: 1800,
      millis: 1800000,
    },
    MONTHLY: {
      standardDays: 0,
      standardHours: 2,
      standardMinutes: 120,
      standardSeconds: 7200,
      millis: 7200000,
    },
    YEARLY: {
      standardDays: 1,
      standardHours: 24,
      standardMinutes: 1440,
      standardSeconds: 86400,
      millis: 86400000,
    },
  })
  .constant('HARDWARE_RAID_RULE_DEFAULT_NAME', 'managerHardRaid')
  .service('Server', function serverF(
    $http,
    $q,
    constants,
    coreConfig,
    $cacheFactory,
    $rootScope,
    $translate,
    WucApi,
    Polling,
    OvhApiOrder,
    OvhApiOrderCatalogPublic,
    OvhHttp,
    SERVERSTATS_PERIOD_ENUM,
    HARDWARE_RAID_RULE_DEFAULT_NAME,
  ) {
    this.OvhApiOrderCatalogPublic = OvhApiOrderCatalogPublic;
    this.OvhApiOrderBaremetalPublicBW = OvhApiOrder.Upgrade().BaremetalPublicBandwidth().v6();
    this.OvhApiOrderBaremetalPrivateBW = OvhApiOrder.Upgrade().BaremetalPrivateBandwidth().v6();

    const self = this;
    const serverCaches = {
      ipmi: $cacheFactory('UNIVERS_DEDICATED_SERVER_IPMI'),
      ovhTemplates: $cacheFactory('UNIVERS_DEDICATED_SERVER_INSTALLATION_OVH_TEMPLATE'),
    };
    const requests = {
      serverDetails: null,
      serverStatistics: null,
      serverStatisticsConst: null,
    };
    const path = {
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

    // TODO delete this
    const serverCache = $cacheFactory('UNIVERS_DEDICATED_SERVER_');

    function resetCache(targetedCache) {
      if (targetedCache && targetedCache !== serverCaches.all) {
        targetedCache.removeAll();
      } else {
        angular.forEach(serverCaches, (_cache) => {
          _cache.removeAll();
        });

        // TODO DELETE
        serverCache.removeAll();
        /* eslint-disable no-restricted-syntax, no-prototype-builtins */
        for (const request in requests) {
          if (requests.hasOwnProperty(request)) {
            requests[request] = null;
          }
        }
        /* eslint-enable no-restricted-syntax, no-prototype-builtins */
      }
    }

    /**
     * Specific API wrapper (this.<get|put|post|delete>), @see 'WucApi' service.
     * Extra params:
     *   broadcast, forceRefresh
     */
    angular.forEach(['get', 'put', 'post', 'delete'], (operationType) => {
      self[operationType] = function buildOperation(productId, url, _opt) {
        const opt = _opt || {};

        if (opt.forceRefresh) {
          resetCache(opt.cache);
        }

        if (!productId) {
          return $q.reject(productId);
        }

        const urlPath = URI.expand((!opt.urlPath && path.product) || opt.urlPath, {
          serviceName: productId,
        }).toString();
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
        ).then(
          (response) => {
            if (opt.cache && operationType !== 'get') {
              // [TRICK] Force refresh of datas when POST|PUT|DELETE
              resetCache(opt.cache);
            }
            if (opt.broadcast) {
              if (opt.broadcastParam) {
                $rootScope.$broadcast(opt.broadcast, opt.broadcastParam);
              } else {
                $rootScope.$broadcast(opt.broadcast, response);
              }
            }
            return response;
          },
          response => $q.reject(response),
        );
      };
    });

    this.getUrlRenew = function getUrlRenew(productId) {
      return $q.when(URI.expand(constants.renew, {
        serviceName: productId,
      }).toString());
    };

    this.getTaskPath = function getTaskPath(productId, taskId) {
      return `apiv6/dedicated/server/${productId}/task/${taskId}`;
    };

    this.addTaskFast = function addTaskFast(productId, task, scopeId) {
      set(task, 'id', task.id || task.taskId);
      const pollPromise = $q.defer();
      Polling.addTaskFast(self.getTaskPath(productId, task.id), task, scopeId).then(
        (state) => {
          pollPromise.resolve(state);
          if (Polling.isDone(state)) {
            $rootScope.$broadcast('tasks.update');
          }
        },
        (data) => {
          pollPromise.reject(data);
          $rootScope.$broadcast('tasks.update');
        },
      );
      return pollPromise.promise;
    };

    this.addTask = function addTask(productId, task, scopeId) {
      const pollPromise = $q.defer();

      Polling.addTask(self.getTaskPath(productId, task.id || task.taskId), task, scopeId).then(
        (state) => {
          pollPromise.resolve(state);
          if (Polling.isDone(state)) {
            $rootScope.$broadcast('tasks.update');
          }
        },
        (data) => {
          pollPromise.reject({ type: 'ERROR', message: data.comment });
          $rootScope.$broadcast('tasks.update');
        },
      );

      return pollPromise.promise;
    };

    this.getSelected = function getSelected(serviceName) {
      return OvhHttp.get('/sws/dedicated/server/{serviceName}', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        broadcast: 'dedicated.server.refreshTabs',
      });
    };

    this.reboot = function reboot(serviceName) {
      return OvhHttp.post('/dedicated/server/{serviceName}/reboot', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        broadcast: 'dedicated.informations.reboot',
      });
    };

    this.getNetboot = function getNetboot(serviceName) {
      return OvhHttp.get('/sws/dedicated/server/{serviceName}/netboot', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
      });
    };

    this.setNetBoot = function setNetBoot(serviceName, bootId, rootDevice) {
      return OvhHttp.put('/dedicated/server/{serviceName}', {
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
    };

    this.updateMonitoring = function updateMonitoring(serviceName, monitoring) {
      return OvhHttp.put('/dedicated/server/{serviceName}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {
          monitoring,
        },
        broadcast: 'dedicated.informations.reload',
      });
    };

    this.getRescueMail = function getRescueMail(productId) {
      return this.get(productId, '', {
        proxypass: true,
        broadcast: 'dedicated.informations.reload',
      });
    };

    this.updateRescueMail = function updateRescueMail(productId, bootId, rescueMail) {
      return this.put(productId, '', {
        data: {
          bootId,
          rescueMail,
        },
        proxypass: true,
        broadcast: 'dedicated.informations.reload',
      });
    };

    this.removeHack = function removeHack(productId) {
      return this.put(productId, '', {
        data: {
          state: 'ok',
        },
        proxypass: true,
        broadcast: 'dedicated.informations.reload',
      });
    };

    this.updateDisplayName = function updateDisplayName({ serviceId, serviceName, displayName }) {
      return OvhHttp.put('/service/{serviceId}', {
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
    };

    this.updateReverse = function updateReverse(productId, serviceName, ip, reverse) {
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
        urlPath: path.ip,
      });
    };

    this.deleteReverse = function deleteReverse(productId, serviceName, ip) {
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
        urlPath: path.ip,
      });
    };

    /* ------- SECONDARY DNS -------*/

    this.getSecondaryDnsList = function getSecondaryDnsList(serviceName, count, offset) {
      return OvhHttp.get('/sws/dedicated/server/{serviceName}/secondaryDNS', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        params: {
          count,
          offset,
        },
      });
    };

    this.listIps = function listIps(serviceName) {
      return OvhHttp.get('/ip', {
        rootPath: 'apiv6',
        params: {
          'routedTo.serviceName': serviceName,
        },
      });
    };

    this.addSecondaryDns = function addSecondaryDns(serviceName, domain, ip) {
      return OvhHttp.post('/dedicated/server/{serviceName}/secondaryDnsDomains', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {
          domain,
          ip,
        },
        broadcast: 'dedicated.secondarydns.reload',
      });
    };

    this.deleteSecondaryDns = function deleteSecondaryDns(serviceName, domain) {
      return OvhHttp.delete('/dedicated/server/{serviceName}/secondaryDnsDomains/{domain}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          domain,
        },
        broadcast: 'dedicated.secondarydns.reload',
      });
    };

    this.getDomainZoneInformation = function getDomainZoneInformation(productId, domain) {
      return this.get(productId, 'secondaryDnsNameDomainToken', {
        params: {
          domain,
        },
        proxypass: true,
      });
    };

    /* ------- FTP BACKUP -------*/

    this.getFtpBackup = function getFtpBackup(serviceName) {
      return OvhHttp.get('/sws/dedicated/server/{serviceName}/backupFtp', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
      });
    };

    this.activateFtpBackup = function activateFtpBackup(serviceName) {
      return OvhHttp.post('/dedicated/server/{serviceName}/features/backupFTP', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        broadcast: 'dedicated.ftpbackup.active',
      });
    };

    this.deleteFtpBackup = function deleteFtpBackup(serviceName) {
      return OvhHttp.delete('/dedicated/server/{serviceName}/features/backupFTP', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        broadcast: 'dedicated.ftpbackup.delete',
      });
    };

    this.requestFtpBackupPassword = function requestFtpBackupPassword(serviceName) {
      return OvhHttp.post('/dedicated/server/{serviceName}/features/backupFTP/password', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        broadcast: 'dedicated.ftpbackup.password',
      });
    };

    this.getFtpBackupIp = function getFtpBackupIp(serviceName, count, offset) {
      return OvhHttp.get('/sws/dedicated/server/{serviceName}/backupFtp/access', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        params: {
          count,
          offset,
        },
      });
    };

    this.getAuthorizableBlocks = function getAuthorizableBlocks(serviceName) {
      return OvhHttp.get('/sws/dedicated/server/{serviceName}/backupFtp/access/authorizableBlocks', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
      });
    };

    this.postFtpBackupIp = function postFtpBackupIp(serviceName, ipBlocksList, ftp, nfs, cifs) {
      return OvhHttp.post('/sws/dedicated/server/{serviceName}/backupFtp/access-add', {
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
      });
    };

    this.putFtpBackupIp = function putFtpBackupIp(serviceName, ipBlock, ftp, nfs, cifs) {
      return OvhHttp.put('/dedicated/server/{serviceName}/features/backupFTP/access/{ipBlock}', {
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
      });
    };

    this.deleteFtpBackupIp = function deleteFtpBackupIp(serviceName, ipBlock) {
      return OvhHttp.delete('/dedicated/server/{serviceName}/features/backupFTP/access/{ipBlock}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          ipBlock,
        },
      });
    };

    this.getFtpBackupOrder = function getFtpBackupOrder(serviceName) {
      return OvhHttp.get('/sws/dedicated/server/{serviceName}/backupFtp/order', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
      });
    };

    this.getFtpBackupOrderDetail = function getFtpBackupOrderDetail(serviceName, capacity) {
      return OvhHttp.get('/sws/dedicated/server/{serviceName}/backupFtp/order/{capacity}/details', {
        rootPath: '2api',
        urlParams: {
          serviceName,
          capacity,
        },
      });
    };

    this.postFtpBackupOrderDetail = function postFtpBackupOrderDetail(
      serviceName,
      duration,
      capacity,
    ) {
      return OvhHttp.post('/order/dedicated/server/{serviceName}/backupStorage/{duration}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          duration,
        },
        data: {
          capacity,
        },
        broadcast: 'server.ftpBackup.refresh',
      });
    };

    /* ------- STATISTICS -------*/

    this.getStatisticsConst = function getStatisticsConst() {
      return self.getModels().then(models => ({
        types: uniq(map(
          models.data.models['dedicated.server.MrtgTypeEnum'].enum,
          type => type.split(':')[0].toUpperCase(),
        )),
        defaultType: 'TRAFFIC',
        periods: models.data.models['dedicated.server.MrtgPeriodEnum'].enum.map(period => snakeCase(period).toUpperCase()),
        defaultPeriod: 'DAILY',
      }));
    };

    this.getNetworkInterfaces = (productId) => {
      let serverName = '';
      return self
        .getSelected(productId)
        .then((server) => {
          serverName = server.name;
          return $http.get([path.dedicatedServer, serverName, 'networkInterfaceController'].join('/'));
        })
        .then((networkInterfaceIds) => {
          const promises = map(networkInterfaceIds.data, networkInterfaceId => $http.get([path.dedicatedServer, serverName, 'networkInterfaceController', networkInterfaceId].join('/')).then(response => response.data));
          return $q.all(promises);
        })
        .catch((err) => {
          if (err.status === 460) {
            return [];
          }

          return $q.reject(err);
        });
    };

    function getPointInterval(period) {
      switch (period) {
        case 'HOURLY': {
          return SERVERSTATS_PERIOD_ENUM.HOURLY;
        }
        case 'DAILY': {
          return SERVERSTATS_PERIOD_ENUM.DAILY;
        }
        case 'WEEKLY': {
          return SERVERSTATS_PERIOD_ENUM.WEEKLY;
        }
        case 'MONTHLY': {
          return SERVERSTATS_PERIOD_ENUM.MONTHLY;
        }
        case 'YEARLY': {
          return SERVERSTATS_PERIOD_ENUM.YEARLY;
        }
        default:
          return null;
      }
    }

    function fillGaps(arrayIn) {
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
            value = prevPoint.value.value; // eslint-disable-line
            unit = prevPoint.value.unit; // eslint-disable-line
          }
        } else {
          unit = point.value.unit; // eslint-disable-line
          value = point.value.value; // eslint-disable-line
        }
        graph.push({
          timestamp,
          unit,
          y: value,
        });
      });
      return graph;
    }


    function buildMRTGResponse(arrayIn, pointInterval) {
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

      response.download.values = fillGaps(arrayIn[0].data);
      response.upload.values = fillGaps(arrayIn[1].data);
      return response;
    }

    function aggregateMRTG(productId, mac, type, period) {
      return self.getSelected(productId).then(server => $q
        .all([
          $http.get([path.dedicatedServer, server.name, 'networkInterfaceController', mac, 'mrtg'].join('/'), {
            params: {
              period: period.toLowerCase(),
              type: `${type.toLowerCase()}:download`,
            },
          }),
          $http.get([path.dedicatedServer, server.name, 'networkInterfaceController', mac, 'mrtg'].join('/'), {
            params: {
              period: period.toLowerCase(),
              type: `${type.toLowerCase()}:upload`,
            },
          }),
        ])
        .then((results) => {
          const pointInterval = getPointInterval(period);
          return buildMRTGResponse(results, pointInterval);
        }));
    }

    this.getStatistics = function getStatistics(productId, mac, type, period) {
      resetCache();
      return aggregateMRTG(productId, mac, type, period);
    };

    /* --------------INTERVENTIONS---------------*/

    this.getInterventions = function getInterventions(serviceName, count, offset) {
      return OvhHttp.get('/sws/dedicated/server/{serviceName}/interventions', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        params: {
          count,
          offset,
        },
      });
    };

    /* --------------IPMI---------------*/

    this.isIpmiActivated = function isIpmiActivated(serviceName) {
      return OvhHttp.get('/dedicated/server/{serviceName}/features/ipmi', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        returnErrorKey: '',
      }).catch((err) => {
        if (err.status === 404) {
          return {
            activated: false,
          };
        }
        return err;
      });
    };

    this.ipmiStartTest = function ipmiStartTest(serviceName, type, ttl) {
      return OvhHttp.post('/dedicated/server/{serviceName}/features/ipmi/test', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {
          ttl,
          type,
        },
      });
    };

    this.ipmiStartConnection = function ipmiStartConnection({
      serviceName, type, ttl, ipToAllow, sshKey, withGeolocation,
    }) {
      let promise = $q.when(ipToAllow);

      if (withGeolocation) {
        promise = this.getIpGeolocation().then(({ ip }) => ip);
      }

      return promise.then(ip => OvhHttp.post('/dedicated/server/{serviceName}/features/ipmi/access', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {
          ttl,
          type,
          sshKey,
          ipToAllow: ip,
        },
      }));
    };

    this.ipmiGetConnection = function ipmiGetConnection(serviceName, type) {
      return OvhHttp.get('/dedicated/server/{serviceName}/features/ipmi/access', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        params: {
          type,
        },
      });
    };

    this.ipmiRestart = function ipmiRestart(serviceName) {
      return OvhHttp.post('/dedicated/server/{serviceName}/features/ipmi/resetInterface', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        broadcast: 'dedicated.ipmi.resetinterfaces',
      });
    };

    this.ipmiSessionsReset = function ipmiSessionsReset(serviceName) {
      return OvhHttp.post('/dedicated/server/{serviceName}/features/ipmi/resetSessions', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        broadcast: 'dedicated.ipmi.resetsessions',
      });
    };

    this.getIpGeolocation = function getIpGeolocation() {
      return OvhHttp.post('/me/geolocation', {
        rootPath: 'apiv6',
      });
    };

    /* --------------TASK---------------*/

    this.getTasks = function getTasks(serviceName, elementsByPage, elementsToSkip) {
      return OvhHttp.get('/sws/dedicated/server/{serviceName}/tasks', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        params: {
          count: elementsByPage,
          offset: elementsToSkip,
        },
      });
    };

    this.getTaskInProgress = function getTaskInProgress(serviceName, type) {
      return OvhHttp.get('/sws/dedicated/server/{serviceName}/tasks/uncompleted', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        params: {
          type,
        },
      });
    };

    /* ------- INSTALLATION -------*/

    this.getOvhTemplates = function getOvhTemplates(serviceName) {
      return OvhHttp.get('/sws/dedicated/server/{serviceName}/installation/templates', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        params: {
          type: 'ovh',
        },
      });
    };

    this.getPersonalTemplates = function getPersonalTemplates(serviceName) {
      return OvhHttp.get('/sws/dedicated/server/{serviceName}/installation/templates', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        params: {
          type: 'personal',
        },
      });
    };

    this.getPartitionSchemes = function getPartitionSchemes(productId, templateName) {
      return this.get(productId, '{templateName}/partitionScheme', {
        urlParams: {
          templateName,
        },
        proxypass: true,
        urlPath: path.installationMe,
      });
    };

    this.getPartitionSchemePriority = function getPartitionSchemePriority(
      productId,
      templateName,
      schemeName,
    ) {
      return this.get(productId, '{templateName}/partitionScheme/{schemeName}', {
        urlParams: {
          templateName,
          schemeName,
        },
        proxypass: true,
        urlPath: path.installationMe,
      });
    };

    this.getOvhPartitionSchemesTemplates = function getOvhPartitionSchemesTemplates(
      serviceName,
      template,
      lang,
      customeInstall,
    ) {
      return OvhHttp.get('/sws/dedicated/server/{serviceName}/installation/{template}/{lang}/partitionSchemes', {
        rootPath: '2api',
        urlParams: {
          serviceName,
          template,
          lang,
          customeInstall,
        },
      });
    };

    this.getOvhPartitionSchemesTemplatesDetail = function getOvhPartitionSchemesTemplatesDetail(
      template,
      partitionScheme,
    ) {
      return OvhHttp.get('/sws/dedicated/server/installationTemplate/{template}/{partitionScheme}/partitions', {
        rootPath: '2api',
        urlParams: {
          template,
          partitionScheme,
        },
      });
    };

    this.postAddPartition = function postAddPartition(
      gabaritName,
      gabaritSchemePartitionName,
      partition,
    ) {
      const data = angular.copy(partition);
      data.type = camelCase(data.typePartition);
      delete data.typePartition;

      data.filesystem = camelCase(data.fileSystem);
      delete data.fileSystem;

      data.size = camelCase(data.partitionSize);
      delete data.partitionSize;

      data.raid = data.raid ? parseInt(data.raid.replace(/_/g, ''), 10) : null;

      delete data.oldMountPoint;

      data.step = camelCase(data.order);
      delete data.order;

      data.mountpoint = data.mountPoint;
      delete data.mountPoint;

      return OvhHttp.post('/me/installationTemplate/{templateName}/partitionScheme/{schemeName}/partition', {
        rootPath: 'apiv6',
        urlParams: {
          templateName: gabaritName,
          schemeName: gabaritSchemePartitionName,
        },
        data,
      });
    };

    this.putSetPartition = function putSetPartition(
      gabaritName,
      gabaritSchemePartitionName,
      partition,
    ) {
      const newPartition = angular.copy(partition);
      newPartition.filesystem = camelCase(newPartition.fileSystem);
      newPartition.mountpoint = newPartition.mountPoint;
      newPartition.size = {
        value: newPartition.partitionSize,
        unit: 'MB',
      };
      newPartition.type = camelCase(newPartition.typePartition);
      newPartition.raid = newPartition.raid ? parseInt(newPartition.raid.replace(/_/g, ''), 10) : null;
      delete newPartition.fileSystem;
      delete newPartition.mountPoint;
      delete newPartition.typePartition;
      delete newPartition.partitionSize;
      delete newPartition.oldMountPoint;

      return OvhHttp.put('/me/installationTemplate/{gabaritName}/partitionScheme/{gabaritSchemePartitionName}/partition/{mountpoint}', {
        rootPath: 'apiv6',
        urlParams: {
          gabaritName,
          gabaritSchemePartitionName,
          mountpoint: partition.oldMountPoint,
        },
        data: newPartition,
      });
    };

    this.deleteSetPartition = function deleteSetPartition(
      gabaritName,
      gabaritSchemePartitionName,
      mountpoint,
    ) {
      return OvhHttp.delete('/me/installationTemplate/{templateName}/partitionScheme/{schemeName}/partition/{mountpoint}', {
        rootPath: 'apiv6',
        urlParams: {
          templateName: gabaritName,
          schemeName: gabaritSchemePartitionName,
          mountpoint,
        },
      });
    };

    this.checkIntegrity = function checkIntegrity(gabaritName) {
      return OvhHttp.post('/me/installationTemplate/{gabaritName}/checkIntegrity', {
        rootPath: 'apiv6',
        urlParams: {
          gabaritName,
        },
      });
    };

    this.putSetGabarit = function putSetGabarit(
      productId,
      gabaritName,
      gabaritNameNew,
      customization,
    ) {
      return this.put(productId, '{gabaritName}', {
        urlParams: {
          gabaritName,
        },
        data: {
          templateName: gabaritNameNew,
          customization,
        },
        proxypass: true,
        urlPath: path.installationMe,
      });
    };

    this.createPartitioningScheme = function createPartitioningScheme(
      productId,
      gabaritName,
      newPartitioningScheme,
    ) {
      return self
        .getPartitionSchemePriority(productId, gabaritName, newPartitioningScheme.name)
        .catch(data => (data.status === 404 ? 'no_partition' : $q.reject(data)))
        .then((status) => {
          if (status === 'no_partition') {
            return self.post(productId, '{gabaritName}/partitionScheme', {
              urlParams: {
                gabaritName,
              },
              data: newPartitioningScheme,
              proxypass: true,
              urlPath: path.installationMe,
            });
          }
          return null;
        });
    };

    this.cloneDefaultPartitioningScheme = function cloneDefaultPartitioningScheme(
      productId,
      gabaritName,
      newPartitioningSchemeName,
    ) {
      return self
        .get(productId, '{gabaritName}/partitionScheme/default/partition', {
          urlParams: {
            gabaritName,
          },
          proxypass: true,
          urlPath: path.installationMe,
        })
        .then((mountpoints) => {
          const getMountpoints = map(mountpoints, mountpoint => self
            .get(productId, '{gabaritName}/partitionScheme/{schemeName}/partition/{mountpoint}', {
              urlParams: {
                gabaritName,
                schemeName: newPartitioningSchemeName,
                mountpoint,
              },
              proxypass: true,
              urlPath: path.installationMe,
              returnErrorKey: null,
            })
            .catch(data => (data.status === 404 ? 'no_mountpoint' : $q.reject(data)))
            .then((status) => {
              if (status === 'no_mountpoint') {
                return self
                  .get(productId, '{gabaritName}/partitionScheme/default/partition/{mountpoint}', {
                    urlParams: {
                      gabaritName,
                      mountpoint,
                    },
                    proxypass: true,
                    urlPath: path.installationMe,
                  })
                  .then(mountpointDetails => self.post(productId, '{gabaritName}/partitionScheme/{schemeName}/partition', {
                    urlParams: {
                      gabaritName,
                      schemeName: newPartitioningSchemeName,
                    },
                    data: {
                      filesystem: mountpointDetails.filesystem,
                      mountpoint: mountpointDetails.mountpoint,
                      raid: mountpointDetails.raid,
                      size: mountpointDetails.size.value,
                      step: mountpointDetails.order,
                      type: mountpointDetails.type,
                      volumeName: mountpointDetails.volumeName,
                    },
                    proxypass: true,
                    urlPath: path.installationMe,
                  }));
              }
              return null;
            }));
          return $q.all(getMountpoints);
        });
    };

    this.startInstallation = function startInstallation(serviceName, templateName, details) {
      return OvhHttp.post('/dedicated/server/{serviceName}/install/start', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {
          details,
          templateName,
        },
      });
    };

    this.deleteGabarit = function deleteGabarit(productId, gabaritName) {
      return this.delete(productId, '{gabaritName}', {
        urlParams: {
          gabaritName,
        },
        broadcast: 'dedicated.installation.gabarit.refresh',
        urlPath: path.installationMe,
        proxypass: true,
      });
    };

    this.hasSqlServerAvailable = function hasSqlServerAvailable(productId) {
      return this.get(productId, 'installation/sqlserver', {});
    };

    this.getSshKey = function getSshKey(productId) {
      return this.get(productId, '', {
        proxypass: true,
        urlPath: path.sshMe,
      });
    };

    /* ------- PRO USE -------*/
    this.getOrderProUseDuration = function getOrderProUseDuration(productId) {
      return this.get(productId, 'professionalUse', {
        proxypass: true,
        urlPath: path.order,
      });
    };

    this.getOrderProUseOrder = function getOrderProUseOrder(productId, duration) {
      return this.get(productId, 'professionalUse/{duration}', {
        urlPath: path.order,
        urlParams: {
          duration,
        },
        proxypass: true,
      });
    };

    this.orderProUse = function orderProUse(productId, duration) {
      return this.post(productId, 'professionalUse/{duration}', {
        urlPath: path.order,
        urlParams: {
          duration,
        },
        proxypass: true,
      });
    };

    /* ------- TASK -------*/

    this.progressInstallation = function progressInstallation(serviceName) {
      return OvhHttp.get('/dedicated/server/{serviceName}/install/status', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        returnErrorKey: '',
      }).catch((error) => {
        if (error.status === 460) {
          return [];
        }
        return $q.reject(error);
      });
    };

    this.getTemplateCapabilities = function getTemplateCapabilities(productId, templateName) {
      return this.get(productId, 'install/templateCapabilities', {
        proxypass: true,
        params: {
          templateName,
        },
      });
    };

    this.cancelTask = function cancelTask(productId, taskId) {
      return this.post(productId, 'task/{taskId}/cancel', {
        urlParams: {
          taskId,
        },
        proxypass: true,
      });
    };

    /* ------- BANDWIDTH -------*/
    this.getBandwidth = function getBandwidth(productId) {
      return this.get(productId, 'specifications/network', {
        proxypass: true,
      })
        .then(data => data)
        .catch((err) => {
          if (err.status === 404 || err.status === 460) {
            return {};
          }
          return $q.reject(err);
        });
    };

    this.getBandwidthOption = function getBandwidthOption(productId) {
      return self
        .get(productId, 'option/BANDWIDTH', {
          proxypass: true,
        })
        .then(
          data => data.state,
          (response) => {
            if (response.status === 404 || response.status === 460) {
              return 'notSubscribed';
            }
            return $q.reject(response);
          },
        );
    };

    this.getBandwidthVrackOption = function getBandwidthVrackOption(productId) {
      return self
        .get(productId, 'option/BANDWIDTH_VRACK', {
          proxypass: true,
        })
        .then(data => data.state)
        .catch((response) => {
          if (response.status === 404 || response.status === 460) {
            return 'notSubscribed';
          }
          return $q.reject(response);
        });
    };

    this.orderBandwidth = function orderBandwidth(productId, opt) {
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
      }).then((durations) => {
        const promises = [];
        const returnData = [];

        angular.forEach(durations, (v) => {
          promises.push(
            self
              .get(productId, 'bandwidth/{duration}', {
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
              })
              .then((details) => {
                returnData.push({
                  durations: v,
                  details,
                });

                return returnData;
              }),
          );
        });

        return $q.all(promises).then(() => returnData, () => returnData);
      }, () => null);
    };

    this.getOrderables = function getOrderables(productId, optionName) {
      return this.get(productId, `orderable/${optionName}`)
        .catch((err) => {
          if (err.status === 460) {
            return {};
          }

          return $q.reject(err);
        });
    };

    this.getOrderableDurations = function getOrderableDurations(productId, data) {
      const dedicatedServerPath = 'order/dedicated/server/{serviceName}';
      return this.get(productId, data.optionName, {
        params: data.params,
        urlPath: dedicatedServerPath,
        proxypass: true,
      }).then((durations) => {
        const returnData = [];
        const promises = map(durations, duration => self
          .get(productId, `${data.optionName}/{duration}`, {
            urlParams: {
              duration,
            },
            params: data.params,
            urlPath: dedicatedServerPath,
            proxypass: true,
          })
          .then((details) => {
            returnData.push({
              durations: duration,
              details,
            });
          }));

        return $q
          .all(promises)
          .then(() => returnData)
          .catch(() => returnData);
      });
    };

    this.postOptionOrder = function postOptionOrder(productId, data) {
      return this.post(productId, `${data.optionName}/{duration}`, {
        urlParams: {
          duration: data.duration,
        },
        data: data.params,
        urlPath: 'order/dedicated/server/{serviceName}',
        proxypass: true,
      });
    };

    this.getOption = function getOption(productId, optionName) {
      return self
        .get(productId, `option/${optionName}`, {
          proxypass: true,
        })
        .then(data => data.state)
        .catch((response) => {
          if (response.status === 404) {
            return 'notSubscribed';
          }
          return $q.reject(response);
        });
    };

    this.cancelOption = function cancelOption(productId, optionName) {
      return self.delete(productId, `option/${optionName}`, {
        proxypass: true,
      });
    };

    this.cancelBandwidthOption = function cancelBandwidthOption(productId) {
      return self.delete(productId, 'option/BANDWIDTH', {
        proxypass: true,
      });
    };

    this.postOrderBandwidth = function postOrderBandwidth(productId, opt) {
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
      }).then(details => details, () => null);
    };

    this.getValidBandwidthPlans = function getValidBandwidthPlans(plans, existingBandwidth) {
      const list = map(plans, (plan) => {
        // Not to include already included plans (existing plan)
        if (!plan.planCode.includes('included')) {
          // Extract bandwidth value from product name
          const bandwidth = parseInt(head(filter(plan.productName.split('-'), ele => /^\d+$/.test(ele))));
          assign(plan, { bandwidth });
          // check if existing bandwidth is not max bandwidth available
          // Reject plans which are default plans i.e., 0 as price
          if (bandwidth > existingBandwidth && plan.prices[2].price.value !== 0) {
            return plan;
          }
        }
        return null;
      });
      return compact(list);
    };

    this.getBareMetalPublicBandwidthOptions = function getBareMetalPublicBandwidthOptions(
      serviceName,
    ) {
      return this.OvhApiOrderBaremetalPublicBW.getPublicBandwidthOptions({ serviceName }).$promise;
    };

    this.getBareMetalPublicBandwidthOrder = function getBareMetalPublicBandwidthOrder(
      serviceName,
      planCode,
    ) {
      this.OvhApiOrderBaremetalPublicBW.resetCache();
      this.OvhApiOrderBaremetalPublicBW.resetQueryCache();
      return this.OvhApiOrderBaremetalPublicBW.getPublicBandwidthOrder({
        serviceName,
        planCode,
      }, {
        quantity: 1,
      }).$promise;
    };

    this.bareMetalPublicBandwidthPlaceOrder = function bareMetalPublicBandwidthPlaceOrder(
      serviceName,
      planCode,
      autoPay,
    ) {
      return this.OvhApiOrderBaremetalPublicBW.postPublicBandwidthPlaceOrder({
        serviceName,
        planCode,
      }, {
        quantity: 1,
        autoPayWithPreferredPaymentMethod: autoPay,
      }).$promise;
    };

    this.getBareMetalPrivateBandwidthOptions = function getBareMetalPrivateBandwidthOptions(
      serviceName,
    ) {
      return this.OvhApiOrderBaremetalPrivateBW.getPrivateBandwidthOptions({ serviceName })
        .$promise;
    };

    this.getBareMetalPrivateBandwidthOrder = function getBareMetalPrivateBandwidthOrder(
      serviceName,
      planCode,
    ) {
      this.OvhApiOrderBaremetalPrivateBW.resetCache();
      this.OvhApiOrderBaremetalPrivateBW.resetQueryCache();
      return this.OvhApiOrderBaremetalPrivateBW.getPrivateBandwidthOrder({
        serviceName,
        planCode,
      }, {
        quantity: 1,
      }).$promise;
    };

    this.bareMetalPrivateBandwidthPlaceOrder = function bareMetalPrivateBandwidthPlaceOrder(
      serviceName,
      planCode,
      autoPay,
    ) {
      return this.OvhApiOrderBaremetalPrivateBW.postPrivateBandwidthPlaceOrder({
        serviceName,
        planCode,
      }, {
        quantity: 1,
        autoPayWithPreferredPaymentMethod: autoPay,
      }).$promise;
    };

    /* ------- Order KVM -------*/
    this.canOrderKvm = function canOrderKvm(productId) {
      return this.get(productId, 'orderable/kvm', {
        cache: serverCaches.ipmi,
        proxypass: true,
        urlPath: path.product,
      });
    };

    this.getKvmOrderDurations = function getKvmOrderDurations(productId) {
      return this.get(productId, 'kvm', {
        urlPath: path.order,
        proxypass: true,
      });
    };

    this.getKvmOrderDetail = function getKvmOrderDetail(productId, duration) {
      return this.get(productId, 'kvm/{duration}', {
        urlPath: path.order,
        proxypass: true,
        urlParams: {
          duration,
        },
      });
    };

    this.getKvmOrderDetails = function getKvmOrderDetails(productId, durations) {
      const promises = [];

      durations.forEach((duration) => {
        promises.push($q.when(this.getKvmOrderDetail(productId, duration)));
      });

      return $q.all(promises);
    };

    this.postKvmOrderInfos = function postKvmOrderInfos(productId, duration) {
      return this.post(productId, 'kvm/{duration}', {
        urlPath: path.order,
        proxypass: true,
        urlParams: {
          duration,
        },
      });
    };

    /* ------- KVM Features -------*/
    this.getKvmFeatures = function getKvmFeatures(productId) {
      return this.get(productId, 'features/kvm', {
        cache: serverCaches.ipmi,
        proxypass: true,
        urlPath: path.product,
      });
    };

    this.getHardwareSpecifications = function getHardwareSpecifications(productId) {
      return this.get(productId, 'specifications/hardware', {
        proxypass: true,
      });
    };

    /* ------- USB STORAGE -------*/
    this.getUsbStorageInformations = function getUsbStorageInformations(productId) {
      const orderable = this.get(productId, 'orderable/usbKey', {
        proxypass: true,
      });

      const specification = this.get(productId, 'specifications/hardware', {
        proxypass: true,
      });

      return $q.all([orderable, specification]);
    };

    this.getUsbStorageDurations = function getUsbStorageDurations(productId, capacity) {
      return this.get(productId, 'usbKey', {
        urlPath: path.order,
        params: {
          capacity,
        },
        proxypass: true,
      });
    };

    this.getUsbStorageOrder = function getUsbStorageOrder(productId, capacity, duration) {
      return this.get(productId, 'usbKey/{duration}', {
        urlPath: path.order,
        urlParams: {
          duration,
        },
        params: {
          capacity,
        },
        proxypass: true,
      });
    };

    this.orderUsbStorage = function orderUsbStorage(productId, capacity, duration) {
      return this.post(productId, 'usbKey/{duration}', {
        urlPath: path.order,
        urlParams: {
          duration,
        },
        data: {
          capacity,
        },
        proxypass: true,
      });
    };

    this.getRtmVersion = function getRtmVersion(serviceName) {
      return OvhHttp.get('/dedicated/server/{serviceName}/statistics', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        returnErrorKey: '',
      });
    };

    this.getOsInformation = function getOsInformation(productId) {
      return self.get(productId, 'statistics/os', {
        proxypass: true,
      });
    };

    this.getStatisticsChart = function getStatisticsChart(productId, opts) {
      return self
        .get(productId, 'statistics/chart', {
          proxypass: true,
          params: {
            period: opts.period,
            type: opts.type,
          },
        })
        .then((results) => {
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
    };

    this.getStatisticsLoadavg = function getStatisticsLoadavg(productId, opts) {
      const loadavgList = ['loadavg1', 'loadavg15', 'loadavg5'];
      const deferedObject = $q.defer();
      const promises = [];
      const data = {};

      angular.forEach(loadavgList, (loadavg) => {
        promises.push(
          self
            .getStatisticsChart(productId, {
              period: opts.period,
              type: loadavg,
            })
            .then((results) => {
              data[loadavg] = results;
            }),
        );
      });

      $q.all(promises).then(
        () => {
          deferedObject.resolve(data);
        },
        (rejection) => {
          deferedObject.reject(rejection);
        },
      );

      return deferedObject.promise;
    };

    this.getMotherBoard = productId => self.get(productId, 'statistics/motherboard', {
      proxypass: true,
    });

    this.getCpu = productId => self.get(productId, 'statistics/cpu', {
      proxypass: true,
    });

    this.getMemory = productId => self.get(productId, 'statistics/memory', {
      proxypass: true,
    });

    this.getInfosServer = (productId) => {
      const deferredObject = $q.defer();
      const promises = [];

      const data = {};

      promises.push(
        self
          .getMotherBoard(productId)
          .then((results) => {
            data.motherboard = results;
          })
          .catch(() => $q.reject({})),
      );

      promises.push(
        self
          .getCpu(productId)
          .then((results) => {
            data.cpu = results;
          })
          .catch(() => $q.reject({})),
      );

      promises.push(
        self
          .getMemory(productId)
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
          .catch(() => $q.reject({})),
      );

      promises.push(
        self
          .getRtmVersion(productId)
          .then((results) => {
            data.rtmVersion = results;
          })
          .catch(() => $q.reject({})),
      );

      promises.push(
        self
          .getOsInformation(productId)
          .then((results) => {
            data.osInfo = results;
          })
          .catch(() => $q.reject({})),
      );

      $q
        .all(promises)
        .then(() => {
          deferredObject.resolve(data);
        })
        .catch((rejection) => {
          deferredObject.reject(rejection);
        });

      return deferredObject.promise;
    };

    this.getDiskCharts = function getDiskCharts(serviceName, period) {
      return OvhHttp.get('/sws/dedicated/server/{serviceName}/rtm/partitions/{period}', {
        urlParams: {
          serviceName,
          period,
        },
      }).then((result) => {
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
    };

    this.getLoad = function getLoad(productId) {
      return self.get(productId, 'statistics/load', {
        proxypass: true,
      });
    };

    this.getRaidInfo = function getRaidInfo(serviceName) {
      return OvhHttp.get('/sws/dedicated/server/{serviceName}/rtm/raid', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
      });
    };

    this.getPartitions = function getPartitions(serviceName) {
      return OvhHttp.get('/sws/dedicated/server/{serviceName}/rtm/partitions', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
      });
    };

    // Monitoring

    /**
             * Get server models
             */
    this.getModels = function getModels() {
      return $http.get('apiv6/dedicated/server.json', { cache: true });
    };

    this.getAllServiceMonitoring = function getAllServiceMonitoring(productId) {
      let promises = [];
      return self
        .get(productId, 'serviceMonitoring', {
          proxypass: true,
        })
        .then((ids) => {
          promises = ids.map(id => self.get(productId, 'serviceMonitoring/{monitoringId}', {
            proxypass: true,
            urlParams: {
              monitoringId: id,
            },
          }));
          return $q.all(promises);
        })
        .catch((error) => {
          if (error.status === 460) {
            return [];
          }
          return $q.reject(error);
        });
    };

    this.getServiceMonitoringIds = function getServiceMonitoringIds(productId) {
      return self.get(productId, 'serviceMonitoring', {
        proxypass: true,
      });
    };

    this.getServiceMonitoring = function getServiceMonitoring(productId, monitoringId) {
      return self.get(productId, 'serviceMonitoring/{monitoringId}', {
        proxypass: true,
        urlParams: {
          monitoringId,
        },
      });
    };

    this.addServiceMonitoring = function addServiceMonitoring(productId, data) {
      return self.post(productId, 'serviceMonitoring', {
        proxypass: true,
        data,
      });
    };

    this.updateServiceMonitoring = function updateServiceMonitoring(
      productId,
      monitoringId,
      serviceMonitoring,
    ) {
      return self.put(productId, 'serviceMonitoring/{monitoringId}', {
        proxypass: true,
        urlParams: {
          monitoringId,
        },
        data: serviceMonitoring,
      });
    };

    this.deleteServiceMonitoring = function deleteServiceMonitoring(productId, monitoringId) {
      return self.delete(productId, 'serviceMonitoring/{monitoringId}', {
        proxypass: true,
        urlParams: {
          monitoringId,
        },
      });
    };

    this.getAllServiceMonitoringNotifications = function getAllServiceMonitoringNotifications(
      productId,
      opts,
    ) {
      return self
        .get(productId, 'serviceMonitoring/{monitoringId}/alert/{type}', {
          proxypass: true,
          urlParams: {
            monitoringId: opts.monitoringId,
            type: opts.type,
          },
        })
        .then((ids) => {
          const promises = ids.map(alertId => self.get(productId, 'serviceMonitoring/{monitoringId}/alert/{type}/{alertId}', {
            proxypass: true,
            urlParams: {
              monitoringId: opts.monitoringId,
              type: opts.type,
              alertId,
            },
          }));
          return $q.all(promises);
        });
    };

    this.getServiceMonitoringNotificationsIds = function getServiceMonitoringNotificationsIds(
      productId,
      opts,
    ) {
      return self.get(productId, 'serviceMonitoring/{monitoringId}/alert/{type}', {
        proxypass: true,
        urlParams: {
          monitoringId: opts.monitoringId,
          type: opts.type,
        },
      });
    };

    this.getServiceMonitoringNotifications = function getServiceMonitoringNotifications(
      productId,
      opts,
    ) {
      return self.get(productId, 'serviceMonitoring/{monitoringId}/alert/{type}/{alertId}', {
        proxypass: true,
        forceRefresh: true,
        urlParams: {
          monitoringId: opts.monitoringId,
          type: opts.type,
          alertId: opts.alertId,
        },
      });
    };

    this.deleteServiceMonitoringNotifications = function deleteServiceMonitoringNotifications(
      productId,
      opts,
    ) {
      return self.delete(productId, 'serviceMonitoring/{monitoringId}/alert/{type}/{alertId}', {
        proxypass: true,
        urlParams: {
          monitoringId: opts.monitoringId,
          type: opts.type,
          alertId: opts.alertId,
        },
        broadcast: ['server.monitoring.notifications', opts.type, 'reload'].join('.'),
      });
    };

    this.addServiceMonitoringNotificationEmail = function addServiceMonitoringNotificationEmail(
      productId,
      opts,
    ) {
      return self.post(productId, 'serviceMonitoring/{monitoringId}/alert/email', {
        proxypass: true,
        urlParams: {
          monitoringId: opts.monitoringId,
        },
        data: opts.data,
        broadcast: 'server.monitoring.notifications.email.reload',
      });
    };

    this.updateServiceMonitoringNotificationEmail = function update(
      productId,
      opts,
    ) {
      return self.put(productId, 'serviceMonitoring/{monitoringId}/alert/email/{alertId}', {
        proxypass: true,
        urlParams: {
          monitoringId: opts.monitoringId,
          alertId: opts.alertId,
        },
        data: opts.data,
        broadcast: 'server.monitoring.notifications.email.reload',
      });
    };

    this.addServiceMonitoringNotificationSMS = function addServiceMonitoringNotificationSMS(
      productId,
      opts,
    ) {
      return self.post(productId, 'serviceMonitoring/{monitoringId}/alert/sms', {
        proxypass: true,
        urlParams: {
          monitoringId: opts.monitoringId,
        },
        data: opts.data,
        broadcast: 'server.monitoring.notifications.sms.reload',
      });
    };

    this.updateServiceMonitoringNotificationSMS = function updateServiceMonitoringNotificationSMS(
      productId,
      opts,
    ) {
      return self.put(productId, 'serviceMonitoring/{monitoringId}/alert/sms/{alertId}', {
        proxypass: true,
        urlParams: {
          monitoringId: opts.monitoringId,
          alertId: opts.alertId,
        },
        data: opts.data,
        broadcast: 'server.monitoring.notifications.sms.reload',
      });
    };

    this.getSms = function getSms(productId) {
      let promises = [];
      if (coreConfig.getRegion() === 'CA') {
        return $q.when([]);
      }
      return self
        .get(productId, '', {
          proxypass: true,
          urlPath: path.sms,
        })
        .then((ids) => {
          promises = ids.map(smsId => self.get(productId, '{serviceName}', {
            proxypass: true,
            urlPath: path.sms,
            urlParams: {
              serviceName: smsId,
            },
          }));
          return $q.all(promises);
        });
    };

    /* ------- Terminate -------*/

    this.terminate = function terminate(serviceName) {
      return OvhHttp.post('/dedicated/server/{serviceName}/terminate', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      });
    };

    this.getRtmHowtoUrl = function getRtmHowtoUrl() {
      let link;
      let lang;

      /* Arbitrary fallback to English */
      const fallbackLang = 'GB';

      const selectedLanguage = $translate.use();

      try {
        lang = selectedLanguage.replace(/^\w{2}_/, '').toUpperCase();
      } catch (e) {
        lang = fallbackLang;
        throw e;
      }

      if (constants.urls && constants.urls[lang] && constants.urls[lang].RealTimeMonitoring) {
        link = constants.urls[lang].RealTimeMonitoring;
      } else {
        link = constants.urls[fallbackLang].RealTimeMonitoring;
      }
      return link;
    };

    this.getVrack = function getVrack(serviceName) {
      return self.getSelected(serviceName).then(selectedServer => $http.get(`apiv6/dedicated/server/${selectedServer.name}/vrack`).then(results => results.data));
    };

    this.getVrackInfos = function getVrackInfos(serviceName) {
      return self
        .getVrack(serviceName)
        .then((results) => {
          const promises = results.map(vrack => $http
            .get(`apiv6/vrack/${vrack}`)
            .then(({ data }) => ({
              serviceName: vrack,
              ...data,
            })));

          return $q.all(promises);
        })
        .catch((error) => {
          if (error.status === 404 || error.status === 460) {
            return $q.resolve(null);
          }

          return $q.reject(error);
        });
    };

    /* ------- Hard Raid -------*/

    this.getHardwareRaidProfile = function getHardwareRaidProfile(serviceName) {
      return self.getSelected(serviceName).then(selectedServer => $http.get(`apiv6/dedicated/server/${selectedServer.name}/install/hardwareRaidProfile`).then(results => results.data));
    };

    this.postHardwareRaid = function postHardwareRaid(
      productId,
      templateName,
      schemeName,
      disks,
      raid,
    ) {
      return this.post(productId, '{templateName}/partitionScheme/{schemeName}/hardwareRaid', {
        urlParams: {
          templateName,
          schemeName,
        },
        data: {
          disks,
          mode: raid,
          name: HARDWARE_RAID_RULE_DEFAULT_NAME,
          step: 1,
        },
        proxypass: true,
        urlPath: path.installationMe,
      });
    };

    this.putHardwareRaid = function putHardwareRaid(
      productId,
      templateName,
      schemeName,
      disks,
      raid,
    ) {
      return this.put(
        productId,
        '{templateName}/partitionScheme/{schemeName}/hardwareRaid/{name}',
        {
          urlParams: {
            templateName,
            schemeName,
            name: HARDWARE_RAID_RULE_DEFAULT_NAME,
          },
          data: {
            disks,
            mode: raid,
            name: HARDWARE_RAID_RULE_DEFAULT_NAME,
            step: 1,
          },
          proxypass: true,
          urlPath: path.installationMe,
        },
      );
    };

    this.getPartitionSchemeHardwareRaid = function getPartitionSchemeHardwareRaid(
      productId,
      templateName,
      schemeName,
    ) {
      return this.get(productId, '{templateName}/partitionScheme/{schemeName}/hardwareRaid', {
        urlParams: {
          templateName,
          schemeName,
        },
        proxypass: true,
        urlPath: path.installationMe,
      }).then((response) => {
        const index = indexOf(response, HARDWARE_RAID_RULE_DEFAULT_NAME);
        if (index !== -1) {
          return self.get(productId, '{templateName}/partitionScheme/{schemeName}/hardwareRaid/{name}', {
            urlParams: {
              templateName,
              schemeName,
              name: response[index],
            },
            proxypass: true,
            urlPath: path.installationMe,
          });
        } if (response.length > 0) {
          return self.get(productId, '{templateName}/partitionScheme/{schemeName}/hardwareRaid/{name}', {
            urlParams: {
              templateName,
              schemeName,
              name: response[0],
            },
            proxypass: true,
            urlPath: path.installationMe,
          });
        }
        return $q.when();
      });
    };

    this.isHardRaidLocationError = function isHardRaidLocationError(error) {
      return error.status === 403 && error.data && error.data.message === 'Not available from this location';
    };

    this.isHardRaidUnavailableError = function isHardRaidUnavailableError(error) {
      return error.status === 403 && error.data && error.data.message === 'Hardware RAID is not supported by this server';
    };

    this.getHighestPriorityPartitionScheme = function getHighestPriorityPartitionScheme(
      productId,
      templateName,
    ) {
      return self.getPartitionSchemes(productId, templateName).then((schemes) => {
        const getSchemes = map(
          schemes,
          scheme => self.getPartitionSchemePriority(productId, templateName, scheme),
        );
        return $q.all(getSchemes).then((schemesDetails) => {
          const list = sortBy(schemesDetails, 'priority').reverse();
          return list[0];
        });
      });
    };

    /**
     * Update service infos.
     * @param  {Object} data
     * @return {Promise}
     */
    this.updateServiceInfos = (serviceName, data) => OvhHttp.put('/dedicated/server/{serviceName}/serviceInfos', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data,
      broadcast: 'dedicated.informations.reload',
    });

    // Service info

    this.getServiceInfos = function getServiceInfos(serviceName) {
      return OvhHttp.get('/dedicated/server/{serviceName}/serviceInfos', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      });
    };

    this.isAutoRenewable = function isAutoRenewable(productId) {
      return this.getSelected(productId).then(server => moment(server.expiration).diff(moment().date(), 'days') > 0);
    };

    this.getUpgradeProductName = (planName, ovhSubsidiary) => this.OvhApiOrderCatalogPublic
      .v6()
      .get({
        productName: 'baremetalServers',
        ovhSubsidiary,
      })
      .$promise
      .then(({ addons, plans, products }) => {
        const plan = find(plans, { invoiceName: planName });
        const cpu = find(products, { name: plan.product });
        const memoryPlan = find(plan.addonFamilies, { name: 'memory' });
        const memory = find(addons, { planCode: memoryPlan.default });

        return `${cpu.description}, ${memory.invoiceName}`;
      });
  });
