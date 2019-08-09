angular.module('Module.ip.services').service('Iplb', [
  '$rootScope',
  '$http',
  '$q',
  'constants',
  'Poll',
  function ($rootScope, $http, $q, constants, Poll) {
    const self = this;
    const swsProxypassPath = 'apiv6';

    // ipCache = cache('UNIVERS_MODULE_IP');

    /* conf not available by api :-/ */
    this.BACKEND_WEIGHT_DEFAULT = 8;
    this.BACKEND_WEIGHT_MIN = 1;
    this.BACKEND_WEIGHT_MAX = 100;

    this.isOptionOrderable = function (serviceName, option) {
      return $http.get([swsProxypassPath, 'order/ip/loadBalancing', serviceName].join('/')).then(response => response && response.data && response.data.length && ~response.data.indexOf(option), http => $q.reject(http.data));
    };

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    this.getTasksToPoll = function (serviceName) {
      /* available actions:
         * =================
         'activateSsl',
         'addBackend',
         'addIpToBackend',
         'announceIpLoadBalancing',
         'backupStateSet',
         'backupStateUnset',
         'changeProbe',
         'delBackend',
         'desactivateSsl',
         'removeIpFromBackend',
         'setPortRedirection',
         'setStickiness',
         'setWeight',
         'unannounceIpLoadBalancing',
         'unsetPortRedirection',
         */
      const managedActions = ['addBackend', 'delBackend', 'setWeight', 'backupStateSet', 'backupStateUnset', 'setStickiness', 'activateSsl', 'desactivateSsl'];

      // @todo filter init todo doing
      return $http.get([swsProxypassPath, 'ip/loadBalancing', serviceName, 'task'].join('/')).then((response) => {
        const queue = [];
        angular.forEach(response.data, (tasksId) => {
          queue.push(
            $http.get([swsProxypassPath, 'ip/loadBalancing', serviceName, 'task', tasksId].join('/')).then((resp) => {
              if (resp.data && resp.data.action && ~managedActions.indexOf(resp.data.action)) {
                self[`poll${resp.data.action}`]({
                  serviceName,
                  taskId: resp.data.id,
                  taskFunction: resp.data.action,
                });
              }
            }),
          );
        });
        return $q.all(queue);
      });
    };

    this.poll = function (opts) {
      // broadcast start with opts
      $rootScope.$broadcast(`${opts.namespace}.start`, opts);

      // do poll
      return Poll.poll([swsProxypassPath, 'ip/loadBalancing', opts.serviceName, 'task', opts.taskId].join('/'), null, {
        namespace: opts.namespace,
      }).then(resp => resp, err => $q.reject(err));
    };

    this.killAllPolling = function () {
      angular.forEach(['setStickiness', 'activateSsl', 'desactivateSsl'], (action) => {
        Poll.kill({ namespace: `iplb.${action}` });
      });
    };

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    // ---

    this.getList = function () {
      return $http.get([swsProxypassPath, 'ip/loadBalancing'].join('/')).then(response => response.data || [], http => $q.reject(http.data));
    };

    this.getDetails = function (serviceName) {
      return $http.get([swsProxypassPath, 'ip/loadBalancing', serviceName].join('/')).then(response => response.data, http => $q.reject(http.data));
    };

    this.getServiceInfos = function (serviceName) {
      return $http.get([swsProxypassPath, 'ip/loadBalancing', serviceName, 'serviceInfos'].join('/')).then(response => response.data, http => $q.reject(http.data));
    };

    this.getInternalNatIp = function (serviceName, zone) {
      return $http
        .get([swsProxypassPath, 'ip/loadBalancing', serviceName, 'internalNatIp'].join('/'), {
          params: { zone },
          cache: true,
        })
        .then(response => response.data && response.data.replace(/"/g, ''), http => $q.reject(http.data));
    };
    this.getProbeIp = function (serviceName, zone) {
      return $http
        .get([swsProxypassPath, 'ip/loadBalancing', serviceName, 'probeIp'].join('/'), {
          params: { zone },
          cache: true,
        })
        .then(response => response.data || [], http => $q.reject(http.data));
    };

    // Stickiness
    this.setStickiness = function (serviceName, stickiness) {
      return $http
        .post([swsProxypassPath, 'ip/loadBalancing', serviceName, 'stickiness'].join('/'), {
          stickiness,
        })
        .then(
          (response) => {
            self.pollsetStickiness({
              serviceName,
              taskId: response.data.id,
              taskFunction: response.data.action,
            });
            return response.data;
          },
          http => $q.reject(http.data),
        );
    };
    this.pollsetStickiness = function (opts) {
      const namespace = `iplb.${opts.taskFunction}`;
      _.set(opts, 'namespace', namespace);
      return self
        .poll({
          serviceName: opts.serviceName,
          taskId: opts.taskId,
          namespace,
        })
        .then(() => self.setStickinessSuccess(opts), () => self.setStickinessError(opts));
    };
    this.setStickinessSuccess = function (opts) {
      return self.getDetails(opts.serviceName).then((infos) => {
        $rootScope.$broadcast(`${opts.namespace}.done`, infos);
      });
    };
    this.setStickinessError = function (opts) {
      $rootScope.$broadcast(`${opts.namespace}.error`, opts);
    };

    /* SSL */

    // Order ssl
    this.getOrderSsl = function (serviceName, domain) {
      return $http.get([swsProxypassPath, 'order/ip/loadBalancing', serviceName, 'ssl'].join('/'), { params: { domain } }).then(response => response.data, http => $q.reject(http.data));
    };
    this.postOrderSsl = function (serviceName, domain) {
      return $http.post([swsProxypassPath, 'order/ip/loadBalancing', serviceName, 'ssl'].join('/'), { domain }).then(response => response.data, http => $q.reject(http.data));
    };

    // Import ssl
    this.importCustomSsl = function (serviceName, model) {
      return $http.post([swsProxypassPath, 'ip/loadBalancing', serviceName, 'importCustomSsl'].join('/'), model).then(
        (response) => {
          self.pollactivateSsl({
            serviceName,
            taskId: response.data.id,
            taskFunction: response.data.action,
          });
          return response.data;
        },
        http => $q.reject(http.data),
      );
    };
    this.pollactivateSsl = function (opts) {
      const namespace = `iplb.${opts.taskFunction}`;
      _.set(opts, 'namespace', namespace);
      return self
        .poll({
          serviceName: opts.serviceName,
          taskId: opts.taskId,
          namespace,
        })
        .then(() => self.activateSslSuccess(opts), () => self.activateSslError(opts));
    };
    this.activateSslSuccess = function (opts) {
      return self.getDetails(opts.serviceName).then((infos) => {
        $rootScope.$broadcast(`${opts.namespace}.done`, infos);
      });
    };
    this.activateSslError = function (opts) {
      $rootScope.$broadcast(`${opts.namespace}.error`, opts);
    };

    // Restore ssl
    this.restoreSsl = function (serviceName) {
      return $http.post([swsProxypassPath, 'ip/loadBalancing', serviceName, 'restoreSsl'].join('/')).then(
        (response) => {
          self.polldesactivateSsl({
            serviceName,
            taskId: response.data.id,
            taskFunction: response.data.action,
          });
          return response.data;
        },
        http => $q.reject(http.data),
      );
    };
    this.polldesactivateSsl = function (opts) {
      const namespace = `iplb.${opts.taskFunction}`;
      _.set(opts, 'namespace', namespace);
      return self
        .poll({
          serviceName: opts.serviceName,
          taskId: opts.taskId,
          namespace,
        })
        .then(() => self.desactivateSslSuccess(opts), () => self.desactivateSslError(opts));
    };
    this.desactivateSslSuccess = function (opts) {
      return self.getDetails(opts.serviceName).then((infos) => {
        $rootScope.$broadcast(`${opts.namespace}.done`, infos);
      });
    };
    this.desactivateSslError = function (opts) {
      $rootScope.$broadcast(`${opts.namespace}.error`, opts);
    };

    /* / SSL */

    /* ZONE */
    this.getOrderPop = function (serviceName, pop) {
      return $http.get([swsProxypassPath, 'order/ip/loadBalancing', serviceName, 'pop'].join('/'), { params: { pop } }).then(response => response.data, http => $q.reject(http.data));
    };
    this.postOrderPop = function (serviceName, pop) {
      return $http.post([swsProxypassPath, 'order/ip/loadBalancing', serviceName, 'pop'].join('/'), { pop }).then(response => response.data, http => $q.reject(http.data));
    };

    /* / ZONE */

    // Backends

    this.getBackends = function (serviceName) {
      return $http.get([swsProxypassPath, 'ip/loadBalancing', serviceName, 'backend'].join('/')).then(response => response.data, http => $q.reject(http.data));
    };

    this.getBackend = function (serviceName, backend) {
      return $http.get([swsProxypassPath, 'ip/loadBalancing', serviceName, 'backend', backend].join('/')).then(response => response.data, http => $q.reject(http.data));
    };
    this.putBackend = function (serviceName, backend, data) {
      return $http.put([swsProxypassPath, 'ip/loadBalancing', serviceName, 'backend', backend].join('/'), data).then(response => response.data, http => $q.reject(http.data));
    };
    this.deleteBackend = function (serviceName, backend) {
      return $http.delete([swsProxypassPath, 'ip/loadBalancing', serviceName, 'backend', backend].join('/')).then(response => response.data, http => $q.reject(http.data));
    };
    this.addBackend = function (serviceName, data) {
      return $http.post([swsProxypassPath, 'ip/loadBalancing', serviceName, 'backend'].join('/'), data).then(response => response.data, http => $q.reject(http.data));
    };

    function pollWithParam(opts, paramNotif) {
      const namespace = `iplb.${opts.taskFunction}`;
      self
        .poll({
          namespace,
          serviceName: opts.serviceName,
          taskId: opts.taskId,
        })
        .then(
          () => {
            $rootScope.$broadcast(`iplb.${paramNotif}.needUpdate`);
          },
          (reason) => {
            $rootScope.$broadcast(`iplb.${paramNotif}.error`, reason);
          },
        );
    }

    this.pollPortList = function (opts) {
      pollWithParam(opts, 'ports');
    };

    this.pollBackendList = function (opts) {
      pollWithParam(opts, 'backends');
    };

    this.polladdBackend = this.pollBackendList;
    this.polldelBackend = this.pollBackendList;

    this.getAllowedBackends = function (serviceName) {
      return $http.get([swsProxypassPath, 'ip/loadBalancing', serviceName, 'allowedBackends'].join('/')).then(response => response.data, http => $q.reject(http.data));
    };

    this.setWeight = function (serviceName, backend, weight) {
      return $http.post([swsProxypassPath, 'ip/loadBalancing', serviceName, 'backend', backend, 'setWeight'].join('/'), { weight }).then(response => response.data, http => $q.reject(http.data));
    };
    this.pollsetWeight = this.pollBackendList;

    this.setBackupState = function (serviceName, backend, data) {
      return $http.post([swsProxypassPath, 'ip/loadBalancing', serviceName, 'backend', backend, 'backupState'].join('/'), data).then(response => response.data, http => $q.reject(http.data));
    };
    this.pollbackupStateSet = this.pollBackendList;
    this.pollbackupStateUnset = this.pollBackendList;

    this.getBackendsInformations = function (serviceName) {
      const deferred = $q.defer();

      if (!self.backendInformations) {
        self.getBackends(serviceName).then((backendIds) => {
          const promises = [];

          angular.forEach(backendIds, (backendId) => {
            promises.push(self.getBackend(serviceName, backendId));
          });

          $q.all(promises).then(
            (data) => {
              self.backendInformations = data;
              deferred.resolve(data);
            },
            (data) => {
              deferred.reject(data);
            },
          );
        });
      } else {
        deferred.resolve(self.backendInformations);
      }

      return deferred.promise;
    };

    this.whoIsMyBackend = function (serviceName, backend) {
      const promise = self.getBackendsInformations(serviceName);

      return promise.then((backends) => {
        const foundBackend = _.find(backends, _backend => _backend.mainBackendIp === backend);

        return foundBackend;
      });
    };

    // Ports redirections

    this.getPortsRedirections = function (serviceName) {
      return $http.get([swsProxypassPath, 'ip/loadBalancing', serviceName, 'portsRedirection'].join('/')).then(response => response.data, http => $q.reject(http.data));
    };

    this.getPortsRedirection = function (serviceName, srcPort) {
      return $http.get([swsProxypassPath, 'ip/loadBalancing', serviceName, 'portsRedirection', srcPort].join('/')).then(response => response.data, http => $q.reject(http.data));
    };
    this.addPortsRedirection = function (serviceName, data) {
      return $http.post([swsProxypassPath, 'ip/loadBalancing', serviceName, 'portsRedirection'].join('/'), data).then(response => response.data, http => $q.reject(http.data));
    };
    this.deletePortsRedirection = function (serviceName, srcPort) {
      return $http.delete([swsProxypassPath, 'ip/loadBalancing', serviceName, 'portsRedirection', srcPort].join('/')).then(response => response.data, http => $q.reject(http.data));
    };
  },
]);
