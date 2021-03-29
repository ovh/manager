angular
  .module('services')
  .service(
    'HostingBoost',
    function hostingBoost(
      $q,
      $rootScope,
      OvhHttp,
      Poll,
      OvhApiOrderCatalogPublic,
    ) {
      /**
       * Get models
       */
      this.getModels = () =>
        OvhHttp.get('/hosting/web.json', {
          rootPath: 'apiv6',
        });

      /**
       * Get tasks
       */
      this.getTasks = (serviceName) => {
        const tasks = [
          OvhHttp.get('/hosting/web/{serviceName}/tasks', {
            rootPath: 'apiv6',
            urlParams: {
              serviceName,
            },
            params: {
              function: 'changeSlot/upgrade',
            },
          }),
          OvhHttp.get('/hosting/web/{serviceName}/tasks', {
            rootPath: 'apiv6',
            urlParams: {
              serviceName,
            },
            params: {
              function: 'changeSlot/downgrade',
            },
          }),
        ];
        return $q.all(tasks);
      };

      /**
       * Obtain hosting boost new price
       */
      this.getBoostPrice = (ovhSubsidiary) =>
        OvhApiOrderCatalogPublic.v6().get({
          ovhSubsidiary,
          productName: 'webHosting',
        }).$promise;

      /**
       * Obtain hosting boost history
       */
      this.getHistory = (serviceName) =>
        OvhHttp.get('/hosting/web/{serviceName}/boostHistory', {
          rootPath: 'apiv6',
          urlParams: {
            serviceName,
          },
        });

      /**
       * Obtain an hosting boost history entry
       */
      this.getHistoryEntry = (serviceName, date) =>
        OvhHttp.get('/hosting/web/{serviceName}/boostHistory/{date}', {
          rootPath: 'apiv6',
          urlParams: {
            serviceName,
            date,
          },
        });

      this.requestBoost = (data) => {
        const self = this;
        return OvhHttp.post('/hosting/web/{serviceName}/requestBoost', {
          rootPath: 'apiv6',
          urlParams: {
            serviceName: data.serviceName,
          },
          data: { offer: data.offer },
          broadcast: 'hosting.tabs.boostHistory.refresh',
        }).then((task) => {
          self.pollBoostRequestState({ serviceName: data.serviceName, task });
        });
      };

      /**
       * Disable boost
       */
      this.disableBoost = (opts) => {
        const self = this;
        return OvhHttp.post('/hosting/web/{serviceName}/requestBoost', {
          rootPath: 'apiv6',
          urlParams: {
            serviceName: opts.serviceName,
          },
          data: { offer: null },
          broadcast: 'hosting.tabs.boostHistory.refresh',
        }).then((task) => {
          self.pollBoostDisableState({ serviceName: opts.serviceName, task });
        });
      };

      /**
       * Poll boost request
       */
      this.pollBoostRequestState = (opts) => {
        const taskId = opts.task.id || opts.task;

        if (!taskId) {
          return $rootScope.$broadcast('hosting.boost.error', '');
        }

        $rootScope.$broadcast('hosting.boost.request.start', opts);

        return Poll.poll(
          ['apiv6/hosting/web', opts.serviceName, 'tasks', taskId].join('/'),
          null,
          {
            successRule: { status: 'done' },
            namespace: 'hosting.boost.request',
          },
        ).then(
          (task) => {
            $rootScope.$broadcast('hosting.boost.request.done', task);
          },
          (err) => {
            $rootScope.$broadcast('hosting.boost.request.error', err);
          },
        );
      };

      /**
       * Poll disable request
       */
      this.pollBoostDisableState = (opts) => {
        const taskId = opts.task.id || opts.task;

        if (!taskId) {
          return $rootScope.$broadcast('hosting.boost.error', '');
        }

        $rootScope.$broadcast(
          ['hosting.boost.disable', 'start'].join('.'),
          opts,
        );

        return Poll.poll(
          ['apiv6/hosting/web', opts.serviceName, 'tasks', taskId].join('/'),
          null,
          {
            successRule: { status: 'done' },
            namespace: 'hosting.boost.disable',
          },
        ).then(
          (task) => {
            $rootScope.$broadcast('hosting.boost.disable.done', task);
          },
          (err) => {
            $rootScope.$broadcast('hosting.boost.disable.error', err);
          },
        );
      };

      this.killAllPolling = () => {
        angular.forEach(['request', 'disable'], (action) => {
          Poll.kill({ namespace: `hosting.boost.${action}` });
        });
      };
    },
  );
