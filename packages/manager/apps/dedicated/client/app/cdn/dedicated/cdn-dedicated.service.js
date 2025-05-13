import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';
import snakeCase from 'lodash/snakeCase';
import startsWith from 'lodash/startsWith';

export default /* @ngInject */ function cdnF(
  $cacheFactory,
  $http,
  $q,
  constants,
  $rootScope,
  Poll,
  OvhHttp,
) {
  const self = this;
  const swsCdnProxyPath = `${constants.swsProxyRootPath}cdn/dedicated`;
  const swsOrderProxyPath = `${constants.swsProxyRootPath}order/cdn/dedicated`;
  const aapiRootPath = '/sws/dedicated/cdn';
  const cdnCache = $cacheFactory('UNIVERS_DEDICATED_CDN');
  const requests = {
    cdnDetails: null,
  };

  function resetCache(key) {
    if (key !== undefined) {
      if (requests[key] !== undefined) {
        requests[key] = null;
      }
      cdnCache.remove(key);
    } else {
      cdnCache.removeAll();
      /* eslint-disable no-restricted-syntax, no-prototype-builtins */
      for (const request in requests) {
        if (requests.hasOwnProperty(request)) {
          requests[request] = null;
        }
      }
      /* eslint-enable no-restricted-syntax, no-prototype-builtins */
    }
  }

  this.getSelected = function getSelected(productId, forceRefresh) {
    if (forceRefresh) {
      resetCache();
    }

    if (productId) {
      const selectedCdn = cdnCache.get('cdn');

      if (!selectedCdn) {
        if (requests.cdnDetails === null) {
          requests.cdnDetails = $http
            .get(`${aapiRootPath}/get-service/${productId}`, {
              serviceType: 'aapi',
            })
            .then((result) => {
              cdnCache.put('cdn', result.data);
              return result.data;
            });
        }
        return $q.when(requests.cdnDetails);
      }
      return $q.when(selectedCdn);
    }
    return $q.reject(productId);
  };

  this.poll = function poll(opts) {
    // broadcast start with opts
    $rootScope.$broadcast(`${opts.namespace}.start`, opts);

    // do poll
    return Poll.poll(
      [swsCdnProxyPath, opts.serviceName, 'ssl/tasks', opts.taskId].join('/'),
      null,
      {
        namespace: opts.namespace,
      },
    ).then((resp) => resp);
  };

  this.killAllPolling = function killAllPolling() {
    angular.forEach(['installSsl'], (action) => {
      Poll.kill({ namespace: `cdn.${action}` });
    });
  };

  this.pollSetSslTask = function pollSetSslTask(opts) {
    const namespace = `cdn.${opts.taskFunction}`;
    set(opts, 'namespace', namespace);
    return self
      .poll({
        serviceName: opts.serviceName,
        taskId: opts.taskId,
        namespace,
      })
      .then((infos) => {
        if (!infos) {
          $rootScope.$broadcast(`${opts.namespace}.error`, opts);
        } else {
          $rootScope.$broadcast(`${opts.namespace}.done`, infos);
        }
      });
  };

  /*
   * Add a domain to the CDN linked to the given backend
   */
  this.addDomain = function addDomain(productId, domain) {
    let result = null;
    return this.getSelected(productId)
      .then((cdn) => {
        if (cdn && cdn.serviceName) {
          return $http
            .post([swsCdnProxyPath, cdn.serviceName, 'domains'].join('/'), {
              domain: domain.domain,
            })
            .then(() =>
              $http
                .post(
                  [
                    swsCdnProxyPath,
                    cdn.serviceName,
                    'domains',
                    domain.domain,
                    'backends',
                  ].join('/'),
                  { ip: domain.backend },
                )
                .then((data) => {
                  result = data;
                }),
            );
        }
        return $q.reject(cdn);
      })
      .then(() => result)
      .catch((http) => $q.reject(http.data));
  };

  /*
   * get the backends for the cdn.
   */
  this.getBackends = function getBackends(productId) {
    let result = null;
    return this.getSelected(productId)
      .then((cdn) => {
        if (cdn && cdn.serviceName) {
          return $http
            .get([aapiRootPath, cdn.serviceName, 'backends'].join('/'), {
              serviceType: 'aapi',
            })
            .then((data) => {
              result = data.data;
            });
        }
        return $q.reject(cdn);
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

  /*
   * get the backends for the cdn.
   */
  this.getBackendPrice = function getBackendPrice(serviceName) {
    return $http
      .get([swsOrderProxyPath, `${serviceName}/backend/01`].join('/'), {
        params: {
          backend: 1,
        },
      })
      .then(
        (response) => ({
          withoutTax: null,
          tax: null,
          withTax: null,
          contracts: null,
          url: null,
          duration: null,
          unitaryPrice: response.data.prices.withoutTax.text,
          quantity: null,
        }),
        (reason) => {
          if (reason && reason.data !== undefined) {
            return $q.reject(reason.data);
          }
          return $q.reject(reason);
        },
      );
  };

  /*
   * get the backends orders for the cdn.
   */
  this.getBackendOrders = function getBackendOrders(productId, quantity) {
    let result = null;
    return this.getSelected(productId)
      .then((cdn) => {
        if (cdn && cdn.serviceName && quantity) {
          return $http
            .get(
              `${[aapiRootPath, cdn.serviceName, 'order', 'backends'].join(
                '/',
              )}?quantity=${quantity}`,
              {
                serviceType: 'aapi',
              },
            )
            .then((data) => {
              result = data.data;
            });
        }
        return $q.reject(cdn);
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

  function transformDuration(serviceName, duration) {
    const regex = /([0-9]+[mdjya]?|uptoFirstDayNextMonth|upto-[0-9]{4}-[0-9]{2}-[0-9]{2})(?:\.(engage\d+(?:m|d|y)))?/;

    const durationObj = {
      duration,
    };

    if (regex.test(duration)) {
      const durationMatch = regex.exec(duration);

      if (durationMatch[1] && startsWith(durationMatch[1], 'upto-')) {
        durationObj.date = new Date(durationMatch[1].substring(5));
      } else {
        const dateMatch = /([0-9]+)([mdjya]{0,1})/g.exec(durationMatch[1]);
        const dateValue = parseInt(dateMatch[1], 10);
        const dateUnit = dateMatch[2];

        durationObj.date = new Date();

        if (dateUnit === 'd' || dateUnit === 'j') {
          durationObj.date.setDate(durationObj.date.getDate() + dateValue);
        } else if (dateUnit === 'y' || dateUnit === 'a') {
          durationObj.date.setFullYear(
            durationObj.date.getFullYear() + dateValue,
          );
        } else {
          durationObj.date.setMonth(durationObj.date.getMonth() + dateValue);
        }
      }

      if (durationMatch[2] && startsWith(durationMatch[2], 'engage')) {
        durationObj.engagementEnd = new Date();

        const engageString = durationMatch[2].substring(6);

        const engageMatch = /([0-9]+)([mdjya]{0,1})/g.exec(engageString);
        const engageValue = parseInt(engageMatch[1], 10);
        const engageUnit = engageMatch[2];

        if (engageUnit === 'd' || engageUnit === 'j') {
          durationObj.engagementEnd.setDate(
            durationObj.engagementEnd.getDate() + engageValue,
          );
        } else if (engageUnit === 'y' || engageUnit === 'a') {
          durationObj.engagementEnd.setFullYear(
            durationObj.engagementEnd.getFullYear() + engageValue,
          );
        } else {
          durationObj.engagementEnd.setMonth(
            durationObj.engagementEnd.getMonth() + engageValue,
          );
        }
      } else {
        durationObj.engagementEnd = null;
      }
    }

    return durationObj;
  }

  /*
   * get the backends for the cdn.
   */
  this.orderBackends = function orderBackends(productId, quantity, duration) {
    let result = null;
    return this.getSelected(productId)
      .then((cdn) => {
        if (cdn && cdn.serviceName && quantity && duration) {
          return $http
            .post(
              [swsOrderProxyPath, cdn.serviceName, 'backend', duration].join(
                '/',
              ),
              { backend: quantity },
            )
            .then((response) => {
              result = {
                withoutTax: response.data.prices.withoutTax.text,
                tax: response.data.prices.tax.text,
                withTax: response.data.prices.withTax.text,
                contracts: response.data.contracts,
                url: response.data.url,
                duration: transformDuration(cdn.serviceName, duration),
                unitaryPrice: null,
                quantity,
              };
            });
        }
        return $q.reject(cdn);
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
   * Get Ssl information for selected service
   */
  this.getSsl = (productId) =>
    this.getSelected(productId).then((cdn) => {
      if (!cdn || !cdn.serviceName) {
        return $q.reject(cdn);
      }

      return $http
        .get([swsCdnProxyPath, cdn.serviceName, 'ssl'].join('/'))
        .then((ssl) => {
          set(ssl, 'data.status', snakeCase(ssl.data.status).toUpperCase());
          return ssl.data;
        })
        .catch(() => ({
          name: null,
          cn: null,
          status: null,
          certificateValidFrom: null,
          certificateValidTo: null,
        }));
    });

  /**
   * Get Ssl information for selected service
   */
  this.getInstallSslTasksIds = function getInstallSslTasksIds(selected) {
    return $http
      .get(
        `${[swsCdnProxyPath, selected, 'ssl/tasks'].join(
          '/',
        )}?function=installSsl`,
      )
      .then((tasksIds) => tasksIds.data);
  };

  function getStatisticsConsts() {
    const cachedStats = cdnCache.get('statistics_consts');

    if (cachedStats) {
      return $q.when(cachedStats);
    }

    return $http.get(`${swsCdnProxyPath}.json`).then(
      (content) => {
        let StatsValueEnum = get(content, [
          'data',
          'models',
          'cdnanycast.StatsValueEnum',
          'enum',
        ]);
        let StatsPeriodEnum = get(content, [
          'data',
          'models',
          'cdnanycast.StatsPeriodEnum',
          'enum',
        ]);

        StatsValueEnum = map(StatsValueEnum, (t) => snakeCase(t).toUpperCase());
        StatsPeriodEnum = map(StatsPeriodEnum, (t) =>
          snakeCase(t).toUpperCase(),
        );

        const stats = {
          types: StatsValueEnum,
          periods: StatsPeriodEnum,
        };

        cdnCache.put('statistics_consts', stats);

        return stats;
      },
      (reason) => {
        if (reason && reason.data !== undefined) {
          return $q.reject(reason.data);
        }
        return $q.reject(reason);
      },
    );
  }

  /**
   * Get the statistics constants for the cdn
   */
  this.getStatisticsConsts = function getStatisticsConstsF(domain) {
    return getStatisticsConsts().then((stats) => ({
      types: !domain ? ['QUOTA'].concat(stats.types) : stats.types,
      defaultType: 'BANDWIDTH',
      periods: stats.periods,
      defaultPeriod: 'DAY',
    }));
  };

  /**
   * Get the statistics for the cdn
   */
  this.getStatistics = function getStatistics(productId, params) {
    let result = null;
    return this.getSelected(productId)
      .then((cdn) => {
        if (cdn && cdn.serviceName) {
          return $http
            .get([aapiRootPath, cdn.serviceName, 'statistics'].join('/'), {
              params,
              serviceType: 'aapi',
            })
            .then((data) => {
              if (data) {
                result = data.data;
              }
            });
        }
        return $q.reject(cdn);
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
   * Delete ssl for selected service
   */
  this.deleteSsl = function deleteSsl(productId) {
    let result = null;
    return this.getSelected(productId)
      .then((cdn) => {
        if (cdn && cdn.serviceName) {
          return $http
            .delete([swsCdnProxyPath, cdn.serviceName, 'ssl'].join('/'))
            .then((data) => {
              result = {
                id: data.data.taskId,
                status: data.data.status,
              };

              result.function = data.function;
            });
        }
        return $q.reject(cdn);
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
   * Add a ssl certificate to the selected service
   */
  this.addSsl = function addSsl(productId, ssl) {
    let result = null;
    return this.getSelected(productId)
      .then((cdn) => {
        if (cdn && cdn.serviceName) {
          return $http
            .post([swsCdnProxyPath, cdn.serviceName, 'ssl'].join('/'), ssl)
            .then((data) => {
              result = data;
              $rootScope.$broadcast('cdn.tabs.ssl.refresh');
            });
        }
        return $q.reject(cdn);
      })
      .then(() => result)
      .catch((http) => $q.reject(http.data));
  };

  /*
   * Update a ssl certificate to the selected service
   */
  this.updateSsl = function updateSsl(serviceName, ssl) {
    return $http
      .post([swsCdnProxyPath, serviceName, 'ssl/update'].join('/'), ssl)
      .then((data) => {
        $rootScope.$broadcast('cdn.tabs.ssl.refresh');
        return data;
      });
  };

  /**
   * Get serviceInfos
   */
  this.getServiceInfos = (serviceName) =>
    OvhHttp.get('/cdn/dedicated/{serviceName}/serviceInfos', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
}
