import get from 'lodash/get';
import head from 'lodash/head';
import includes from 'lodash/includes';
import isString from 'lodash/isString';
import remove from 'lodash/remove';
import set from 'lodash/set';
import 'moment';

import { ADDITIONAL_DISK, IP_PRIMARY_TYPE } from './constants';

export default /* @ngInject */ function VpsService(
  $cacheFactory,
  $http,
  $q,
  $rootScope,
  $timeout,
  $translate,
  CucServiceHelper,
  OvhApiIp,
  VpsTaskService,
) {
  const aapiRootPath = '/sws/vps';

  const swsVpsProxypass = '/vps';

  const swsOrderProxypass = '/order/vps';

  const swsPriceProxypass = '/price/vps';

  const vpsCache = $cacheFactory('UNIVERS_WEB_VPS');

  const vpsInfoCache = $cacheFactory('VPS_INFO_CACHE');

  const vpsTabVeeamCache = $cacheFactory('UNIVERS_WEB_VPS_TABS_VEEAM');

  const apiCatalogProductName = 'vps';

  const vpsTabBackupStorageCache = $cacheFactory(
    'UNIVERS_WEB_VPS_TABS_BACKUP_STORAGE',
  );

  const requests = {
    vpsDetails: null,
  };

  const self = this;

  this.events = {
    tabVeeamChanged: 'vps.tabs.veeam.changed',
  };

  this.getTaskInProgress = function getTaskInProgress(serviceName, type) {
    let result = null;
    return this.getSelectedVps(serviceName)
      .then((vps) => {
        if (vps && vps.name) {
          return $http
            .get([aapiRootPath, vps.name, 'tasks/uncompleted'].join('/'), {
              serviceType: 'aapi',
              params: {
                type,
              },
            })
            .then((data) => {
              result = data.data;
            });
        }
        return $q.reject(vps);
      })
      .then(
        () => result,
        (http) => $q.reject(http.data),
      );
  };

  this.getTaskInError = function getTaskInError(serviceName) {
    let result = null;
    return this.getSelectedVps(serviceName)
      .then((vps) => {
        if (vps && vps.name) {
          return $http
            .get([aapiRootPath, vps.name, 'tasks/error'].join('/'), {
              serviceType: 'aapi',
            })
            .then((data) => {
              result = data.data;
            });
        }
        return $q.reject(vps);
      })
      .then(
        () => result,
        (http) => $q.reject(http.data),
      );
  };

  function resetTabVeeam() {
    vpsTabVeeamCache.removeAll();
    $rootScope.$broadcast(self.events.tabVeeamChanged);
  }

  /*
   * Private function to reset the cache
   *
   */
  function resetCache(key) {
    if (key !== undefined) {
      if (requests[key] !== undefined) {
        requests[key] = null;
      }
      vpsCache.remove(key);
    } else {
      vpsCache.removeAll();
      vpsInfoCache.removeAll();
      // eslint-disable-next-line no-restricted-syntax
      for (const request in requests) {
        // eslint-disable-next-line no-prototype-builtins
        if (requests.hasOwnProperty(request)) {
          requests[request] = null;
        }
      }
    }
  }

  /*
   * same as getSelected without using Products (it causes problem when changing vps
   * using sidebar)
   */
  this.getSelectedVps = function getSelectedVps(serviceName) {
    return $http
      .get([aapiRootPath, serviceName, 'info'].join('/'), {
        serviceType: 'aapi',
        cache: vpsInfoCache,
      })
      .then((result) => {
        set(
          result,
          'data.secondaryDns',
          result.data.secondaryDns === 0
            ? $translate.instant('vps_dashboard_secondary_dns_count_0')
            : $translate.instant('vps_dashboard_secondary_dns_count_x', {
                count: result.data.secondaryDns,
              }),
        );
        return result.data;
      })
      .catch(CucServiceHelper.errorHandler('vps_dashboard_loading_error'));
  };

  /*
   * Get monitoring data
   */
  this.getMonitoring = function getMonitoring(serviceName, period) {
    let monitoring = null;

    const p = period != null ? period : 'lastday';
    return this.getSelectedVps(serviceName)
      .then((vps) => {
        if (vps && vps.name) {
          return $http
            .get([aapiRootPath, vps.name, 'monitoring'].join('/'), {
              serviceType: 'aapi',
              params: { period: p },
            })
            .then((data) => {
              if (data) {
                monitoring = data.data;
              } else {
                $q.reject(
                  `${aapiRootPath + vps.name}/monitoring?period=${p} : No data`,
                );
              }
            });
        }
        return $q.reject(vps);
      })
      .then(() => {
        if (monitoring !== null) {
          return monitoring;
        }
        return null;
      })
      .catch(
        CucServiceHelper.errorHandler('vps_configuration_monitoring_fail'),
      );
  };

  /*
   * reset VPS password
   */
  this.resetPassword = function resetPassword(serviceName) {
    let result = null;
    return this.getSelectedVps(serviceName)
      .then((vps) => {
        if (vps && vps.name) {
          return $http
            .post([swsVpsProxypass, vps.name, 'setPassword'].join('/'))
            .then((data) => {
              result = data.data;
            });
        }
        return $q.reject(vps);
      })
      .then(
        () => {
          VpsTaskService.initPoller(serviceName, 'vps.detail');
          return result;
        },
        (http) => $q.reject(http.data),
      );
  };

  /*
   * Reboot the VPS
   */
  this.reboot = function reboot(serviceName, rescueMode) {
    let result = null;
    return this.getSelectedVps(serviceName)
      .then((vps) => {
        if (vps && vps.name) {
          const netbootMode = rescueMode ? 'rescue' : 'local';
          if (vps.netbootMode === netbootMode.toUpperCase()) {
            return $http
              .post([swsVpsProxypass, vps.name, 'reboot'].join('/'))
              .then((data) => {
                result = data.data;
              });
          }

          // The modification of netbootMode for a vps other than CLOUD 2014v1 model will make
          // the VPS reboot. So ask an explicit reboot only if the VPS is a CLOUD 2014v1
          if (vps.offerType === 'CLOUD' && vps.version === '_2014_V_1') {
            // Sleep for 40 seconds because the netboot change take some seconds to apply.
            // It's not a good solution, it's like that since the begin
            return $http
              .put([swsVpsProxypass, vps.name].join('/'), { netbootMode })
              .then(() =>
                $timeout(
                  () =>
                    $http
                      .post([swsVpsProxypass, vps.name, 'reboot'].join('/'))
                      .then((data) => {
                        result = data.data;
                      }),
                  40000,
                ),
              );
          }
          return $http.put([swsVpsProxypass, vps.name].join('/'), {
            netbootMode,
          });
        }
        return $q.reject(vps);
      })
      .then(
        () => {
          resetCache();
          VpsTaskService.initPoller(serviceName, 'vps.detail');
          return result;
        },
        (http) => $q.reject(http.data),
      );
  };

  /*
   * Get a KVM access for the VPS
   */
  this.getKVMAccess = function getKVMAccess(serviceName) {
    return $http
      .post([swsVpsProxypass, serviceName, 'openConsoleAccess'].join('/'), {
        protocol: 'VNCOverWebSocket',
      })
      .then((data) => data.data)
      .catch(CucServiceHelper.errorHandler());
  };

  this.getKVMConsoleUrl = function getKVMConsoleUrl(serviceName) {
    let result = null;
    return $http
      .post([swsVpsProxypass, serviceName, 'getConsoleUrl'].join('/'))
      .then(
        (response) => {
          result = response.data;
        },
        (err) => $q.reject(err.data),
      )
      .then(
        () => {
          resetCache();
          $rootScope.$broadcast('vps.dashboard.refresh');
          return result;
        },
        (http) => $q.reject(http.data),
      );
  };

  /*
   * return the templates list available for this VPS
   */
  this.getTemplates = function getTemplates(serviceName) {
    return $http
      .get([aapiRootPath, serviceName, 'templates'].join('/'), {
        serviceType: 'aapi',
      })
      .then((response) => response.data)
      .catch(CucServiceHelper.errorHandler('vps_configuration_polling_fail'));
  };

  /*
   * Reinstall the VPS using the template identified by templateId
   */
  this.reinstall = function reinstall(
    serviceName,
    templateId,
    language,
    softIds,
    publicSshKey,
    doNotSendPassword,
  ) {
    if (!templateId) {
      return $q.reject('No templateId');
    }
    return $http
      .post([swsVpsProxypass, serviceName, 'reinstall'].join('/'), {
        language,
        softwareId: softIds,
        publicSshKey,
        doNotSendPassword: Boolean(doNotSendPassword),
        templateId,
      })
      .then((response) => {
        resetCache();
        VpsTaskService.initPoller(serviceName, 'vps.detail');
        return response.data;
      })
      .catch(CucServiceHelper.errorHandler('vps_configuration_reinstall_fail'))
      .finally(() =>
        this.CucCloudMessage.success(
          this.$translate.instant('vps_configuration_reinstall_success', {
            serviceName: this.serviceName,
          }),
        ),
      );
  };

  /*
   * return the ip list for this VPS
   */
  this.getIps = function getIps(serviceName) {
    return $http
      .get([aapiRootPath, serviceName, 'ips'].join('/'), {
        serviceType: 'aapi',
      })
      .then((data) => data.data)
      .catch(CucServiceHelper.errorHandler());
  };

  /*
   * Reinstall the VPS using the template identified by templateId
   */
  this.setReversesDns = function setReversesDns(serviceName, ips) {
    let result = null;
    return this.getSelectedVps(serviceName)
      .then((vps) => {
        if (!ips) {
          return $q.reject('No ips');
        }

        if (vps && vps.name) {
          const ip = head(ips.results);
          const ipType = get(ip, 'type');

          if (ipType === IP_PRIMARY_TYPE) {
            return $http
              .post([aapiRootPath, vps.name, 'ips', 'reverse'].join('/'), ips, {
                serviceType: 'aapi',
              })
              .then(({ data }) => {
                result = data;
              });
          }

          return OvhApiIp.Reverse()
            .v6()
            .create(
              {
                ip: ip.ipAddress,
              },
              {
                ipReverse: ip.ipAddress,
                reverse: ip.reverse,
              },
            ).$promise;
        }

        return $q.reject(vps);
      })
      .then(
        () => {
          resetCache();
          $rootScope.$broadcast('vps.dashboard.refresh');
          return result;
        },
        (http) => $q.reject(http.data),
      );
  };

  /*
   * Get content of summary tabs
   */
  this.getTabSummary = function getTabSummary(serviceName, forceRefresh) {
    let vpsName = null;
    return this.getSelectedVps(serviceName)
      .then((vps) => {
        if (vps && vps.name && !vps.isExpired) {
          vpsName = vps.name;
          if (forceRefresh) {
            resetCache(`tabSummary_${vpsName}`);
          }
          const tabSummary = vpsCache.get(`tabSummary_${vpsName}`);
          if (!tabSummary) {
            vpsCache.put(`tabSummary_${vps.name}`, true);
            return $http
              .get([aapiRootPath, vps.name, 'tabsummary'].join('/'), {
                serviceType: 'aapi',
              })
              .then((response) => {
                if (response.status < 300) {
                  vpsCache.put(`tabSummary_${vpsName}`, response.data);
                  return vpsCache.get(`tabSummary_${vpsName}`);
                }
                return $q.reject(response);
              });
          }
          return tabSummary;
        }
        return $q.reject(vps);
      })
      .then(() => {
        const result = vpsCache.get(`tabSummary_${vpsName}`);
        if (
          result &&
          (!result.messages ||
            (angular.isArray(result.messages) && result.messages.length === 0))
        ) {
          return result;
        }
        if (result && result.messages.length !== 0) {
          return $q.reject(result.messages);
        }
        return $q.reject(result);
      })
      .catch((error) => error);
  };

  this.getSnapshotUrl = function getSnapshotUrl(serviceName) {
    return $http
      .get(`/vps/${serviceName}/snapshot/download`)
      .then(({ data }) => data);
  };

  /*
   * Get content of secondary DNS tab
   */
  this.getTabSecondaryDns = function getTabSecondaryDns(
    serviceName,
    count,
    offset,
  ) {
    let vpsName = null;

    let offsetFinal = offset;

    let countFinal = count;

    let cacheKey = null;
    return this.getSelectedVps(serviceName)
      .then((vps) => {
        if (vps && vps.name) {
          vpsName = vps.name;
          if (!count) {
            countFinal = 0;
          }
          if (!offset) {
            offsetFinal = 0;
          }
          cacheKey = `tabSecondaryDNS_${vpsName}_count=${countFinal}_offset=${offsetFinal}`;
          const tabSummary = vpsCache.get(cacheKey);
          if (!tabSummary) {
            vpsCache.put(cacheKey, true);
            return $http
              .get([aapiRootPath, vps.name, 'tabsecondarydns'].join('/'), {
                serviceType: 'aapi',
              })
              .then((response) => {
                if (response.status < 300) {
                  vpsCache.put(cacheKey, response.data);
                  return vpsCache.get(cacheKey);
                }
                return $q.reject(response);
              });
          }
          return tabSummary;
        }
        return $q.reject(vps);
      })
      .then(
        () => {
          const result = vpsCache.get(cacheKey);
          if (
            result &&
            (!result.messages ||
              (angular.isArray(result.messages) &&
                result.messages.length === 0))
          ) {
            return result;
          }
          if (result && result.messages.length !== 0) {
            return $q.reject(result.messages);
          }
          return $q.reject(result);
        },
        (reason) => {
          if (reason && reason.data !== undefined) {
            return $q.reject(reason.data);
          }
          return $q.reject(reason);
        },
      );
  };

  /*
   * Get the secondary DNS available for this VPS
   */
  this.getSecondaryDNSAvailable = function getSecondaryDNSAvailable(
    serviceName,
  ) {
    return this.getSelectedVps(serviceName)
      .then((vps) => {
        if (vps && vps.name) {
          const tabSummary = vpsCache.get('tabSecondaryDNS_dns_available');
          if (!tabSummary) {
            vpsCache.put('tabSecondaryDNS_dns_available', true);
            return $http
              .get(
                [
                  swsVpsProxypass,
                  vps.name,
                  'secondaryDnsNameServerAvailable',
                ].join('/'),
              )
              .then((response) => {
                if (response.status < 300) {
                  vpsCache.put('tabSecondaryDNS_dns_available', response.data);
                  return vpsCache.get('tabSecondaryDNS_dns_available');
                }
                return $q.reject(response);
              });
          }
          return tabSummary;
        }
        return $q.reject(vps);
      })
      .then(
        () => {
          const result = vpsCache.get('tabSecondaryDNS_dns_available');
          if (
            result &&
            (!result.messages ||
              (angular.isArray(result.messages) &&
                result.messages.length === 0))
          ) {
            return result;
          }
          if (result && result.messages.length !== 0) {
            return $q.reject(result.messages);
          }
          return $q.reject(result);
        },
        (reason) => {
          if (reason && reason.data !== undefined) {
            return $q.reject(reason.data);
          }
          return $q.reject(reason);
        },
      );
  };

  /*
   * Add a domain to the secondary DNS for the VPS
   *
   */
  this.addSecondaryDnsDomain = function addSecondaryDnsDomain(
    serviceName,
    domain,
  ) {
    let result = null;
    return this.getSelectedVps(serviceName)
      .then((vps) => {
        if (vps && vps.name) {
          return $http
            .post(
              [swsVpsProxypass, vps.name, 'secondaryDnsDomains'].join('/'),
              { domain },
            )
            .then((data) => {
              result = data.data;
            });
        }
        return $q.reject(vps);
      })
      .then(
        () => {
          resetCache();
          $rootScope.$broadcast('vps.tabs.secondarydns.refresh');
          $rootScope.$broadcast('vps.dashboard.vpsonly.refresh');
          return result;
        },
        (reason) => {
          if (reason && reason.data !== undefined) {
            return $q.reject(reason.data);
          }
          return $q.reject(reason);
        },
      );
  };

  /*
   * delete the domain from secondary DNS
   */
  this.deleteSecondaryDnsDomain = function deleteSecondaryDnsDomain(
    serviceName,
    domain,
  ) {
    let result = null;
    return this.getSelectedVps(serviceName)
      .then((vps) => {
        if (vps && vps.name && domain) {
          return $http
            .delete(
              [swsVpsProxypass, vps.name, 'secondaryDnsDomains', domain].join(
                '/',
              ),
            )
            .then((data) => {
              result = data.data;
            });
        }
        return $q.reject(vps);
      })
      .then(
        () => {
          resetCache();
          $rootScope.$broadcast('vps.tabs.secondarydns.refresh');
          $rootScope.$broadcast('vps.dashboard.vpsonly.refresh');
          return result;
        },
        (reason) => {
          if (reason && reason.data !== undefined) {
            return $q.reject(reason.data);
          }
          return $q.reject(reason);
        },
      );
  };

  /*
   * create a snapshot for the VPS
   */
  this.takeSnapshot = function takeSnapshot(serviceName, description) {
    let result = null;
    let vpsName = null;
    return this.getSelectedVps(serviceName)
      .then((vps) => {
        if (vps && vps.name) {
          vpsName = vps.name;
          return $http
            .post(
              [swsVpsProxypass, vps.name, 'createSnapshot'].join('/'),
              description,
            )
            .then((data) => {
              result = data.data;
            });
        }
        return $q.reject(vps);
      })
      .then(
        () => {
          resetCache(`tabSummary_${vpsName}`);
          VpsTaskService.initPoller(serviceName, 'vps.detail');
          return result;
        },
        (reason) => {
          if (reason && reason.data !== undefined) {
            return $q.reject(reason.data);
          }
          return $q.reject(reason);
        },
      );
  };

  /*
   * restore a snapshot for the VPS
   */
  this.restoreSnapshot = function restoreSnapshot(serviceName) {
    let result = null;
    return this.getSelectedVps(serviceName)
      .then((vps) => {
        if (vps && vps.name) {
          return $http
            .post([swsVpsProxypass, vps.name, 'snapshot/revert'].join('/'))
            .then((data) => {
              result = data.data;
            });
        }
        return $q.reject(vps);
      })
      .then(
        () => {
          resetCache();
          VpsTaskService.initPoller(serviceName, 'vps.detail');
          return result;
        },
        (reason) => {
          if (reason && reason.data !== undefined) {
            return $q.reject(reason.data);
          }
          return $q.reject(reason);
        },
      );
  };

  /*
   * delete the snapshot for the VPS
   */
  this.deleteSnapshot = function deleteSnapshot(serviceName) {
    let result = null;
    let vpsName = null;
    return this.getSelectedVps(serviceName)
      .then((vps) => {
        if (vps && vps.name) {
          vpsName = vps.name;
          return $http
            .delete([swsVpsProxypass, vps.name, 'snapshot'].join('/'))
            .then((data) => {
              result = data.data;
            });
        }
        return $q.reject(vps);
      })
      .then(
        () => {
          resetCache(`tabSummary_${vpsName}`);
          VpsTaskService.initPoller(serviceName, 'vps.detail');
          return result;
        },
        (reason) => {
          if (reason && reason.data !== undefined) {
            return $q.reject(reason.data);
          }
          return $q.reject(reason);
        },
      );
  };

  /*
   * order an option for the VPS
   */
  this.orderOption = function orderOption(serviceName, option, duration) {
    let result = null;
    let vpsName = null;
    return this.getSelectedVps(serviceName)
      .then((vps) => {
        if (vps && vps.name && option && duration) {
          vpsName = vps.name;
          return $http
            .post(
              [aapiRootPath, vps.name, 'order', 'options'].join('/'),
              { option, duration },
              { serviceType: 'aapi' },
            )
            .then((data) => {
              result = data.data;
            });
        }
        return $q.reject(vps);
      })
      .then(
        () => {
          resetCache(`tabSummary_${vpsName}`);
          return result;
        },
        (reason) => {
          if (reason && reason.data !== undefined) {
            return $q.reject(reason.data);
          }
          return $q.reject(reason);
        },
      );
  };

  /*
   * get details for an option for the VPS
   */
  this.getOptionDetails = function getOptionDetails(serviceName, option) {
    let result = null;
    return this.getSelectedVps(serviceName)
      .then((vps) => {
        if (vps && vps.name && option) {
          return $http
            .get([aapiRootPath, vps.name, 'options', option].join('/'), {
              serviceType: 'aapi',
            })
            .then((data) => {
              result = data.data;
            });
        }
        return $q.reject(vps);
      })
      .then(
        () => result,
        (reason) => {
          if (reason && reason.data !== undefined) {
            return $q.reject(reason.data);
          }
          return $q.reject(reason);
        },
      );
  };

  this.getOptionSnapshotFormated = function getOptionSnapshotFormated(
    serviceName,
  ) {
    return this.getOptionDetails(
      serviceName,
      'snapshot',
    ).then((optionDetails) => head(optionDetails.results));
  };

  this.getPriceOptions = function getPriceOptions(vps) {
    return $http.get(
      [
        '/price/vps',
        vps.version.toLowerCase().replace(/_/g, ''),
        vps.offerType.toLowerCase(),
        'option/automatedBackup',
      ].join('/'),
    );
  };

  this.cancelOption = function cancelOption(serviceName, option) {
    return this.getSelectedVps(serviceName).then((vps) =>
      $http
        .delete([swsVpsProxypass, vps.name, 'option', option].join('/'))
        .catch((err) =>
          err && err.data ? $q.reject(err.data) : $q.reject(err),
        ),
    );
  };

  this.upgradeAdditionalDisk = function upgradeAdditionalDisk(
    serviceName,
    planCode,
  ) {
    return $http
      .post(`/order/upgrade/vpsAdditionalDisk/${serviceName}/${planCode}`)
      .then(({ data }) => data);
  };

  this.getOptionStatus = function getOptionStatus(serviceName, option) {
    return this.getSelectedVps(serviceName).then((vps) =>
      $http
        .get([swsVpsProxypass, vps.name, 'option', option].join('/'))
        .then((response) => response.data),
    );
  };

  /*
   * upgrade the VPS tothe specified model
   */
  this.upgrade = function upgrade(serviceName, model, duration) {
    let result = null;
    return this.getSelectedVps(serviceName)
      .then((vps) => {
        if (vps && vps.name && model && duration) {
          return $http
            .post(
              [swsOrderProxypass, vps.name, 'upgrade', duration].join('/'),
              { model },
            )
            .then((data) => {
              result = data.data;
            });
        }
        return $q.reject(vps);
      })
      .then(
        () => {
          resetCache();
          return result;
        },
        (reason) => {
          if (reason && reason.data !== undefined) {
            return $q.reject(reason.data);
          }
          return $q.reject(reason);
        },
      );
  };

  /*
   * get details for an option for the VPS
   */
  this.upgradesList = function upgradesList(serviceName) {
    let result = null;
    return this.getSelectedVps(serviceName)
      .then((vps) => {
        if (vps && vps.name) {
          return $http
            .get([aapiRootPath, vps.name, 'upgrade'].join('/'), {
              serviceType: 'aapi',
            })
            .then((data) => {
              result = data.data;
            });
        }
        return $q.reject(vps);
      })
      .then(
        () => result,
        (reason) => {
          if (reason && reason.data !== undefined) {
            return $q.reject(reason.data);
          }
          return $q.reject(reason);
        },
      );
  };

  /**
   * Get content of veeam tab
   * @param serviceName {String}: Internal VPS service name
   * @returns {Promise}: return current schedule backup
   */
  this.getVeeamInfo = function getVeeamInfo(serviceName) {
    return $http
      .get([swsVpsProxypass, serviceName, 'automatedBackup'].join('/'))
      .then(({ data }) => data);
  };

  this.getVeeamAttachedBackup = function getVeeamAttachedBackup(serviceName) {
    return $http
      .get(
        [swsVpsProxypass, serviceName, 'automatedBackup/attachedBackup'].join(
          '/',
        ),
      )
      .then((response) => response.data);
  };

  this.getVeeam = function getVeeam(serviceName) {
    let info;
    return $q
      .all([
        self.getVeeamInfo(serviceName),
        self.getVeeamAttachedBackup(serviceName),
      ])
      .then((response) => {
        if (response.length > 1) {
          info = head(response);
          info.accessInfos = head(response[1]);
        }
        return info;
      })
      .catch(() => ({ state: 'disabled' }));
  };

  this.getTabVeeam = function getTabVeeam(serviceName, state, forceRefresh) {
    if (forceRefresh) {
      resetTabVeeam();
    }
    return $http
      .get(
        [swsVpsProxypass, serviceName, 'automatedBackup/restorePoints'].join(
          '/',
        ),
        {
          params: {
            state,
          },
          cache: vpsTabVeeamCache,
        },
      )
      .then((response) => response.data);
  };

  this.veeamRestorePointMount = function veeamRestorePointMount(
    serviceName,
    restorePoint,
  ) {
    return this.getSelectedVps(serviceName).then((vps) =>
      $http
        .post(
          [swsVpsProxypass, vps.name, 'automatedBackup/restore'].join('/'),
          {
            changePassword: false,
            restorePoint,
            type: 'file',
          },
        )
        .then((response) => {
          resetTabVeeam();
          VpsTaskService.initPoller(serviceName, 'vps.detail');
          return response.data;
        }),
    );
  };

  this.veeamRestorePointRestore = function veeamRestorePointRestore(
    serviceName,
    restorePoint,
    changePassword,
  ) {
    return this.getSelectedVps(serviceName).then((vps) =>
      $http
        .post(
          [swsVpsProxypass, vps.name, 'automatedBackup/restore'].join('/'),
          {
            changePassword,
            restorePoint,
            type: 'full',
          },
        )
        .then((response) => {
          resetTabVeeam();
          VpsTaskService.initPoller(serviceName, 'vps.detail');
          return response.data;
        }),
    );
  };

  this.veeamRestorePointUmount = function veeamRestorePointUmount(
    serviceName,
    restorePoint,
  ) {
    return this.getSelectedVps(serviceName).then((vps) =>
      $http
        .post(
          [swsVpsProxypass, vps.name, 'automatedBackup/detachBackup'].join('/'),
          {
            restorePoint,
          },
        )
        .then((response) => {
          resetTabVeeam();
          VpsTaskService.initPoller(serviceName, 'vps.detail');
          return response.data;
        }),
    );
  };

  /**
   * Get option veeam
   */
  this.getVeeamOption = function getVeeamOption(serviceName) {
    return this.getSelectedVps(serviceName).then((vps) =>
      $http
        .get([aapiRootPath, vps.name, 'automatedBackup'].join('/'), {
          serviceType: 'aapi',
          cache: vpsCache,
        })
        .then((response) => response.data)
        .catch((error) => error.data),
    );
  };

  /**
   * Order the option veeam
   */
  this.orderVeeamOption = (serviceName, duration) =>
    this.getSelectedVps(serviceName)
      .then((vps) =>
        $http.post(
          [swsOrderProxypass, vps.name, 'automatedBackup', duration].join('/'),
          {},
        ),
      )
      .then((response) => response.data);
  /**
   * Update the VPS
   */
  this.update = function update(serviceName, newValue) {
    return this.getSelectedVps(serviceName).then((vps) =>
      $http
        .put([swsVpsProxypass, vps.name].join('/'), newValue)
        .then((response) => {
          resetCache();
          VpsTaskService.initPoller(serviceName, 'vps.detail');
          return response.data;
        }),
    );
  };

  /**
   * Update the VPS display name
   */
  this.updateDisplayName = function updateDisplayName(
    serviceName,
    displayName,
  ) {
    return $http
      .put([swsVpsProxypass, serviceName].join('/'), { displayName })
      .then((response) => {
        resetCache();
        $rootScope.$broadcast('global_display_name_change', {
          serviceName,
          displayName,
        });
        return response.data;
      });
  };

  // BackupStorage

  this.getBackupStorageInformation = function getBackupStorageInformation(
    serviceName,
  ) {
    return $http
      .get([aapiRootPath, serviceName, 'backupStorage'].join('/'), {
        serviceType: 'aapi',
      })
      .then((response) => {
        const backupInfo = response.data;
        if (backupInfo.activated === true && backupInfo.quota) {
          if (backupInfo.usage === 0) {
            backupInfo.usage = {
              unit: '%',
              value: 0,
            };
          }
        }
        return backupInfo;
      })
      .catch(CucServiceHelper.errorHandler());
  };

  this.getBackupStorageTab = function getBackupStorageTab(
    serviceName,
    count,
    offset,
  ) {
    vpsTabBackupStorageCache.removeAll();
    return $http
      .get([aapiRootPath, serviceName, 'backupStorage/access'].join('/'), {
        serviceType: 'aapi',
        cache: vpsTabBackupStorageCache,
        params: {
          count,
          offset,
        },
      })
      .then((response) => response.data);
  };

  this.getBackupStorageAuthorizableBlocks = function getBackupStorageAuthorizableBlocks(
    serviceName,
  ) {
    return this.getSelectedVps(serviceName).then((vps) =>
      $http
        .get(
          [
            aapiRootPath,
            vps.name,
            'backupStorage/access/authorizableBlocks',
          ].join('/'),
          { serviceType: 'aapi' },
        )
        .then((response) => response.data),
    );
  };

  this.postBackupStorageAccess = function postBackupStorageAccess(
    serviceName,
    ipBlocksList,
    ftp,
    nfs,
    cifs,
  ) {
    return this.getSelectedVps(serviceName).then((vps) =>
      $http
        .post(
          [aapiRootPath, vps.name, 'backupStorage/access/add'].join('/'),
          {
            ipBlocksList,
            ftp,
            nfs,
            cifs,
          },
          { serviceType: 'aapi' },
        )
        .then((response) => response.data),
    );
  };

  this.putBackupStorageAccess = function putBackupStorageAccess(
    serviceName,
    ipBlock,
    ftp,
    nfs,
    cifs,
  ) {
    return this.getSelectedVps(serviceName).then((vps) =>
      $http
        .put(
          [
            swsVpsProxypass,
            vps.name,
            'backupftp',
            'access',
            encodeURIComponent(ipBlock),
          ].join('/'),
          {
            ftp,
            nfs,
            cifs,
          },
        )
        .then((response) => response.data),
    );
  };

  this.deleteBackupStorageAccess = function deleteBackupStorageAccess(
    serviceName,
    ipBlock,
  ) {
    return this.getSelectedVps(serviceName).then((vps) =>
      $http
        .delete(
          [
            swsVpsProxypass,
            vps.name,
            'backupftp',
            'access',
            encodeURIComponent(ipBlock),
          ].join('/'),
        )
        .then((response) => response.data),
    );
  };

  this.requestFtpBackupPassword = function requestFtpBackupPassword(
    serviceName,
  ) {
    return this.getSelectedVps(serviceName).then((vps) =>
      $http
        .post([swsVpsProxypass, vps.name, 'backupftp/password'].join('/'))
        .then((response) => response.data),
    );
  };

  this.getWindowsOptionDurations = function getWindowsOptionDurations(
    serviceName,
  ) {
    return this.getSelectedVps(serviceName).then((vps) =>
      $http
        .get([swsOrderProxypass, vps.name, 'windows'].join('/'))
        .then((response) => response.data),
    );
  };

  this.getWindowsOptionOrder = function getWindowsOptionOrder(
    serviceName,
    duration,
  ) {
    return this.getSelectedVps(serviceName).then((vps) =>
      $http
        .get([swsOrderProxypass, vps.name, 'windows', duration].join('/'))
        .then((response) => response.data),
    );
  };

  this.postWindowsOptionOrder = function postWindowsOptionOrder(
    serviceName,
    duration,
  ) {
    return this.getSelectedVps(serviceName).then((vps) =>
      $http
        .post([swsOrderProxypass, vps.name, 'windows', duration].join('/'))
        .then((response) => response.data),
    );
  };

  this.canOrderOption = (serviceName, optionName) =>
    $http.get([swsOrderProxypass, serviceName].join('/')).then((response) => {
      if (includes(response.data, optionName)) {
        return response.data;
      }
      return $q.reject(ADDITIONAL_DISK.HAS_NO_OPTION);
    });

  this.getAdditionalDiskPrices = function getAdditionalDiskPrices(serviceName) {
    return this.getSelectedVps(serviceName).then((vps) =>
      $q
        .all([
          $http.get(
            [
              swsPriceProxypass,
              '2015v1',
              vps.offerType.toLowerCase(),
              'option',
              ADDITIONAL_DISK.CAPACITIES[0].option,
            ].join('/'),
          ),
          $http.get(
            [
              swsPriceProxypass,
              '2015v1',
              vps.offerType.toLowerCase(),
              'option',
              ADDITIONAL_DISK.CAPACITIES[1].option,
            ].join('/'),
          ),
          $http.get(
            [
              swsPriceProxypass,
              '2015v1',
              vps.offerType.toLowerCase(),
              'option',
              ADDITIONAL_DISK.CAPACITIES[2].option,
            ].join('/'),
          ),
          $http.get(
            [
              swsPriceProxypass,
              '2015v1',
              vps.offerType.toLowerCase(),
              'option',
              ADDITIONAL_DISK.CAPACITIES[3].option,
            ].join('/'),
          ),
        ])
        .then((responses) => {
          const prices = [];
          let i = 0;
          angular.forEach(responses, (capacity) => {
            set(capacity, 'data.type', ADDITIONAL_DISK.CAPACITIES[i].option);
            set(capacity, 'data.size', ADDITIONAL_DISK.CAPACITIES[i].size);
            i += 1;
            prices.push(capacity.data);
          });
          return prices;
        }),
    );
  };

  this.getAllowedDuration = function getAllowedDuration(serviceName, capacity) {
    return this.getSelectedVps(serviceName).then((vps) => {
      const url = [swsOrderProxypass, vps.name, 'additionalDisk'].join('/');
      return $http
        .get(url, { params: { additionalDiskSize: capacity } })
        .then((duration) => duration.data[0]);
    });
  };

  this.getAdditionalDiskFinalPrice = function getAdditionalDiskFinalPrice(
    serviceName,
    capacity,
    duration,
  ) {
    return this.getSelectedVps(serviceName).then((vps) => {
      const url = [
        swsOrderProxypass,
        vps.name,
        'additionalDisk',
        duration,
      ].join('/');
      return $http
        .get(url, { params: { additionalDiskSize: capacity } })
        .then((response) => response.data);
    });
  };

  this.postAdditionalDiskOrder = function postAdditionalDiskOrder(
    serviceName,
    capacity,
    duration,
  ) {
    return this.getSelectedVps(serviceName).then((vps) => {
      const url = [
        swsOrderProxypass,
        vps.name,
        'additionalDisk',
        duration,
      ].join('/');
      return $http
        .post(url, { additionalDiskSize: capacity })
        .then((response) => response.data);
    });
  };

  this.getDisks = function getDisks(serviceName) {
    return $http
      .get([swsVpsProxypass, serviceName, 'disks'].join('/'))
      .then((response) => response.data)
      .catch(CucServiceHelper.errorHandler('vps_dashboard_loading_error'));
  };

  this.getDiskInfo = function getDiskInfo(serviceName, id) {
    return $http
      .get([swsVpsProxypass, serviceName, 'disks', id].join('/'))
      .then((response) => response.data)
      .catch(CucServiceHelper.errorHandler('vps_dashboard_loading_error'));
  };

  this.getUpgradableAdditionalDisk = function getUpgradableAdditionalDisk(
    catalog,
    vpsLinkedDisk,
  ) {
    return $http
      .get(`/order/upgrade/vpsAdditionalDisk/${vpsLinkedDisk.serviceName}`)
      .then(({ data }) => data)
      .then((disks) =>
        disks.map((disk) => {
          return {
            ...disk,
            capacity: catalog.products.find(
              ({ name }) => name === disk.productName,
            ).blobs.technical.storage.disks[0].capacity,
          };
        }),
      )
      .then((disks) =>
        disks.filter(({ capacity }) => capacity > vpsLinkedDisk.size),
      )
      .catch(() => []);
  };

  this.showOnlyAdditionalDisk = function showOnlyAdditionalDisk(disks) {
    remove(disks, (currentObject) => currentObject.type === 'primary');
    return disks;
  };

  // Service info
  this.getServiceInfos = function getServiceInfos(serviceName) {
    return this.getSelectedVps(serviceName).then((vps) =>
      $http
        .get([swsVpsProxypass, serviceName, 'serviceInfos'].join('/'))
        .then((response) => {
          response.data.offer = vps.model;
          return response.data;
        })
        .catch(CucServiceHelper.errorHandler('vps_dashboard_loading_error')),
    );
  };

  this.getEngagement = function getEngagement(serviceId) {
    return $http
      .get(`/services/${serviceId}/billing/engagement`)
      .then((response) => (isString(response.data) ? null : response.data))
      .catch(() => null);
  };

  this.isAutoRenewable = function isAutoRenewable(serviceName) {
    return this.getSelectedVps(serviceName).then(
      (vps) => moment(vps.expiration).diff(moment().date(), 'days') > 0,
    );
  };

  this.getCatalog = function(ovhSubsidiary) {
    return $http
      .get(`/order/catalog/public/${apiCatalogProductName}`, {
        params: {
          ovhSubsidiary,
        },
      })
      .then(({ data }) => data);
  };

  this.updateServiceInfo = function updateServiceInfo(serviceInfo) {
    return $http.put(`${swsVpsProxypass}/${serviceInfo.domain}/serviceInfos`, {
      renew: serviceInfo.renew,
    });
  };

  // Schedule backup

  /**
   * return vps details
   * @param serviceName {String}: Internal VPS service name
   * @returns {Promise}
   */
  this.getVpsInfo = function getVpsInfo(serviceName) {
    return $http.get(`/vps/${serviceName}`).then(({ data }) => data);
  };

  /**
   * return vps option details
   * @param serviceName {String}: Internal VPS service name
   * @param option {String}: Internal option name to get
   * @returns {Promise}
   */
  this.getVpsOption = function getVpsOption(serviceName, option) {
    return $http
      .get(`/vps/${serviceName}/option/${option}`)
      .then(({ data }) => data);
  };

  /**
   * Update the scheduled backup time
   * @param serviceName {String}: Internal VPS service name
   * @param schedule {datetime}: New scheduled backup time
   * @returns {Promise}
   */
  this.scheduleBackup = function scheduleBackup(serviceName, schedule) {
    return $http
      .post(`/vps/${serviceName}/automatedBackup/reschedule`, { schedule })
      .then(({ data }) => data);
  };

  this.isResellerResourceProductName = function isResellerResourceProductName(
    serviceId,
  ) {
    return $http
      .get(`/services/${serviceId}`)
      .then(({ data }) => data?.resource?.product?.name.includes('-resell'));
  };
}
