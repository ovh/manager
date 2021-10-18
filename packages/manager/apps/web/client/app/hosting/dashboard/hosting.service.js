import clone from 'lodash/clone';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import includes from 'lodash/includes';
import indexOf from 'lodash/indexOf';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import replace from 'lodash/replace';
import toLower from 'lodash/toLower';
import union from 'lodash/union';

{
  const hostingCache = 'UNIVERS_WEB_HOSTING';
  const passwordConditions = {
    min: 8,
    max: 30,
  };

  angular.module('services').service(
    'Hosting',
    class Hosting {
      constructor(
        $q,
        $http,
        $rootScope,
        $stateParams,
        constants,
        WucConverterService,
        HOSTING,
        HOSTING_UPGRADES,
        HOSTING_OPERATION_STATUS,
        OvhHttp,
        Poll,
      ) {
        this.$q = $q;
        this.$http = $http;
        this.$rootScope = $rootScope;
        this.$stateParams = $stateParams;
        this.constants = constants;
        this.WucConverterService = WucConverterService;
        this.HOSTING = HOSTING;
        this.HOSTING_UPGRADES = HOSTING_UPGRADES;
        this.HOSTING_OPERATION_STATUS = HOSTING_OPERATION_STATUS;
        this.OvhHttp = OvhHttp;
        this.Poll = Poll;

        this.cloudWebUnlimitedQuantity = 100000;
        this.events = {
          dashboardRefresh: 'hosting.dashboard.refresh',
          tabCronsRefresh: 'hosting.tabs.crons.refresh',
          tabDomainsRefresh: 'hosting.tabs.domains.refresh',
          tabDatabasesRefresh: 'hosting.tabs.databases.refresh',
          tabDatabasesCreation: 'hosting.tabs.databases.creation',
          tabRuntimesRefresh: 'hosting.tabs.runtimes.refresh',
          tabEnvvarsRefresh: 'hosting.tabs.envvars.refresh',
          tasksChanged: 'hosting.tabs.tasks.refresh',
          tabFtpRefresh: 'hosting.tabs.ftp.refresh',
        };
      }

      /* -------------------------BROADCAST-------------------------*/

      /**
       * Broadcast reset databases event
       */
      resetDatabases() {
        this.$rootScope.$broadcast(this.events.tabDatabasesRefresh);
      }

      /**
       * Broadcast reset users event
       */
      resetUsers() {
        this.$rootScope.$broadcast(this.events.tabFtpRefresh);
      }

      /**
       * Broadcast reset domains event
       */
      resetDomains() {
        this.$rootScope.$broadcast(this.events.tabDomainsRefresh);
      }

      /**
       * Broadcast reset cron event
       */
      resetCrons() {
        this.$rootScope.$broadcast(this.events.tabCronsRefresh);
      }

      /**
       * Broadcast reset runtimes event
       */
      resetRuntimes() {
        this.$rootScope.$broadcast(this.events.tabRuntimesRefresh);
      }

      /**
       * Broadcast reset envvars event
       */
      resetEnvvars() {
        this.$rootScope.$broadcast(this.events.tabEnvvarsRefresh);
      }

      /* -------------------------MODELS-------------------------*/

      /**
       * Get models
       */
      getModels() {
        return this.OvhHttp.get('/hosting/web.json', {
          rootPath: 'apiv6',
          cache: 'HOSTING_WEB_MODELS',
        });
      }

      /* -------------------------TOOLS-------------------------*/

      /**
       * Get password conditions object
       * @param {{min: *, max: *}|null} customConditions
       * @returns {{min: *, max: *}}
       */
      static getPasswordConditions(customConditions = undefined) {
        const min = get(customConditions, 'min', passwordConditions.min);
        const max = get(customConditions, 'max', passwordConditions.max);
        return { min, max };
      }

      /**
       * Is hosting performance offer
       * @param {string} offer
       * @returns {boolean}
       */
      static isPerfOffer(offer) {
        return /^perf.+$/.test(offer);
      }

      /**
       * Is password valid
       * @param {string} password
       * @param {{min: number, max: number}|null} customConditions
       * @returns {boolean}
       */
      static isPasswordValid(password, customConditions = undefined) {
        const min = get(customConditions, 'min', passwordConditions.min);
        const max = get(customConditions, 'max', passwordConditions.max);
        return !!(
          password &&
          password.length >= min &&
          password.length <= max &&
          password.match(/.*[0-9].*/) &&
          password.match(/.*[a-z].*/) &&
          password.match(/.*[A-Z].*/) &&
          password.match(/^[a-zA-Z0-9]+$/)
        );
      }

      /**
       * Is path valid
       * @param {string} path
       * @returns {boolean}
       */
      static isPathValid(path) {
        return /^[\w./-]*$/.test(path) && !/\.\./.test(path);
      }

      /**
       * Get remaining quotas
       * @param {object} quotaSize
       * @param {object} quotaUsed
       * @returns {number}
       */
      static getRemainingQuota(quotaSize, quotaUsed) {
        switch (quotaUsed.unit) {
          case 'MB':
            if (quotaSize.unit === 'MB') {
              return quotaSize.value - quotaUsed.value;
            }
            return quotaSize.value * 1000 - quotaUsed.value;
          case 'GB':
            if (quotaSize.unit === 'MB') {
              return quotaSize.value - quotaUsed.value * 1000;
            }
            return quotaUsed.value * 1000 - quotaSize.value * 1000;
          default:
            return quotaSize.value - quotaUsed.value;
        }
      }

      /* -------------------------HOSTING/WEB-------------------------*/

      /**
       * Get selected hosting service
       * @param {string} serviceName
       * @param {boolean} forceRefresh
       */
      getSelected(serviceName, forceRefresh = false) {
        return this.OvhHttp.get(`/sws/hosting/web/${serviceName}`, {
          rootPath: '2api',
          cache: hostingCache,
          clearCache: forceRefresh,
        }).then((originalHosting) => {
          const hosting = cloneDeep(originalHosting);
          hosting.isCloudWeb = includes(hosting.offer, 'CLOUD');

          if (hosting.isCloudWeb) {
            hosting.configurationQuota = this.HOSTING.cloudWeb.configurationQuota;
            hosting.totalQuota = clone(
              this.HOSTING.cloudWeb.configurationQuota,
            );

            const configurationOctet = this.WucConverterService.convertToOctet(
              hosting.configurationQuota.value,
              hosting.configurationQuota.unit,
            );
            const quotaSizeOctet = this.WucConverterService.convertToOctet(
              hosting.quotaSize.value,
              hosting.quotaSize.unit,
            );

            hosting.totalQuota.unit = 'B';
            hosting.totalQuota.value = configurationOctet + quotaSizeOctet;
          }

          if (hosting.offer === 'START_10_M') {
            return this.OvhHttp.get(`/domain/${serviceName}/serviceInfos`, {
              rootPath: 'apiv6',
              cache: hostingCache,
              clearCache: forceRefresh,
            })
              .then((data) => {
                hosting.expiration = data.expiration;
                return hosting;
              })
              .catch(() => hosting);
          }

          return hosting;
        });
      }

      /**
       * Get hosting services list
       */
      getHostings() {
        return this.OvhHttp.get('/hosting/web', {
          rootPath: 'apiv6',
        });
      }

      /**
       * Get specific hosting service
       * @param {string} serviceName
       * @param {array|null} catchOpt
       */
      getHosting(serviceName, catchOpt) {
        return this.$http
          .get(`/hosting/web/${serviceName}`)
          .then((response) => response.data)
          .catch((http) => {
            if (isArray(catchOpt) && indexOf(catchOpt, http.status) !== -1) {
              return null;
            }
            return this.$q.reject(http);
          });
      }

      /**
       * Update hosting service
       * @param {string} serviceName
       * @param {object} opts
       */
      updateHosting(serviceName, opts) {
        return this.OvhHttp.put(`/hosting/web/${serviceName}`, {
          rootPath: 'apiv6',
          broadcast: this.events.dashboardRefresh,
          clearAllCache: true,
          data: opts.body,
        });
      }

      /**
       * Get hosting service info
       * @param {string} serviceName
       */
      getServiceInfos(serviceName) {
        return this.OvhHttp.get(`/hosting/web/${serviceName}/serviceInfos`, {
          rootPath: 'apiv6',
        });
      }

      /**
       * Get content of domains tab
       * @param {string} serviceName
       * @param {integer} count
       * @param {integer} offset
       * @param {string|null} search
       */
      getTabDomains(serviceName, count, offset, search) {
        return this.OvhHttp.get(`/sws/hosting/web/${serviceName}/domains`, {
          rootPath: '2api',
          params: {
            count,
            offset,
            search,
          },
        });
      }

      /**
       * Get content of databases tab
       * @param {string} serviceName
       * @param {integer} count
       * @param {integer} offset
       * @param {string|null} search
       */
      getTabDatabases(serviceName, count, offset, search) {
        return this.OvhHttp.get(`/sws/hosting/web/${serviceName}/databases`, {
          rootPath: '2api',
          params: {
            count,
            offset,
            search,
          },
        });
      }

      /**
       * Get content of ftp tab
       * @param {string} serviceName
       * @param {integer} count
       * @param {integer} offset
       * @param {boolean} needUsers
       * @param {string|null} search
       */
      getTabFTP(serviceName, count, offset, needUsers, search) {
        return this.OvhHttp.get(`/sws/hosting/web/${serviceName}/ftp`, {
          rootPath: '2api',
          params: {
            count,
            offset,
            needUsers,
            search,
          },
        });
      }

      /**
       * Get tasks list
       * @param {string} serviceName
       * @param {integer} count
       * @param {integer} offset
       */
      getTasksList(serviceName, count, offset) {
        return this.OvhHttp.get(`/sws/hosting/web/${serviceName}/tasks`, {
          rootPath: '2api',
          params: {
            count,
            offset,
          },
        });
      }

      /**
       * Flush Cdn
       * @param {string} serviceName
       */
      flushCdn(serviceName) {
        return this.OvhHttp.post(`/hosting/web/${serviceName}/request`, {
          rootPath: 'apiv6',
          data: {
            action: 'FLUSH_CACHE',
          },
        });
      }

      /**
       * Terminate Cdn
       * @param {string} serviceName
       */
      terminateCdn(serviceName) {
        return this.OvhHttp.post(`/hosting/web/${serviceName}/cdn/terminate`, {
          rootPath: 'apiv6',
        });
      }

      /**
       * Retrieve e-mail options
       * @param {string} serviceName
       */
      getEmailOptions(serviceName) {
        return this.OvhHttp.get(`/hosting/web/${serviceName}/emailOption`, {
          rootPath: 'apiv6',
        }).then((ids) => {
          return this.$q.all(
            ids.map((id) => {
              return this.OvhHttp.get(
                `/hosting/web/${serviceName}/emailOption/${id}`,
                {
                  rootPath: 'apiv6',
                },
              );
            }),
          );
        });
      }

      /**
       * Terminate Email option
       * @param {string} serviceName
       * @param {string} email option id
       */
      terminateEmailOption(serviceName, id) {
        return this.OvhHttp.post(
          `/hosting/web/${serviceName}/emailOption/${id}/terminate`,
          {
            rootPath: 'apiv6',
          },
        );
      }

      /**
       * Get available offers
       * @param {string} domain
       */
      getAvailableOffer(domain) {
        return this.getServiceInfos(domain)
          .then(({ serviceId }) => {
            return this.OvhHttp.get(`/services/${serviceId}`, {
              rootPath: 'apiv6',
            });
          })
          .then(({ parentServiceId }) => {
            // if the service is included in another offer it cannot be upgraded
            if (parentServiceId === null) {
              return this.OvhHttp.get('/hosting/web/availableOffer', {
                rootPath: 'apiv6',
                params: {
                  domain,
                },
              });
            }
            return [];
          });
      }

      /**
       * Get offer capabilities
       * @param {string} offer
       */
      getOfferCapabilities(offer) {
        const formattedOffer = this.HOSTING_UPGRADES.includes(offer)
          ? offer
          : replace(toLower(offer), /_/g, '');

        return this.OvhHttp.get('/hosting/web/offerCapabilities', {
          rootPath: 'apiv6',
          params: {
            offer: formattedOffer,
          },
        });
      }

      /**
       * MyOvhOrg migration
       * @param {string} serviceName
       * @param {string} destinationServiceName
       */
      migrateMyOvhOrg(serviceName, destinationServiceName) {
        return this.OvhHttp.post(
          `/hosting/web/${serviceName}/migrateMyOvhOrg`,
          {
            rootPath: 'apiv6',
            data: {
              destinationServiceName,
            },
          },
        );
      }

      /**
       * Get list of user accounts that have access to webserver logs
       * @param {string} serviceName
       */
      getUserLogs(serviceName) {
        return this.OvhHttp.get(`/hosting/web/${serviceName}/userLogs`, {
          rootPath: 'apiv6',
        });
      }

      /**
       * Get user account
       * @param {string} serviceName
       * @param {string} login
       */
      getUserLogsEntry(serviceName, login) {
        return this.OvhHttp.get(
          `/hosting/web/${serviceName}/userLogs/${login}`,
          {
            rootPath: 'apiv6',
          },
        );
      }

      /**
       * Get user token
       * @param {string} serviceName
       * @param {object} opts
       */
      getUserLogsToken(serviceName, opts) {
        return this.OvhHttp.get(`/hosting/web/${serviceName}/userLogsToken`, {
          rootPath: 'apiv6',
          params: opts.params,
        });
      }

      /**
       * Delete a user
       * @param {string} serviceName
       * @param {string} login
       */
      deleteUserLogs(serviceName, login) {
        return this.OvhHttp.delete(
          `/hosting/web/${serviceName}/userLogs/${login}`,
          {
            rootPath: 'apiv6',
            broadcast: 'hosting.userLogs.refresh',
          },
        );
      }

      /**
       * Change password of a user
       * @param {string} serviceName
       * @param {string} login
       * @param {string} newPassword
       */
      userLogsChangePassword(serviceName, login, newPassword) {
        return this.OvhHttp.post(
          `/hosting/web/${serviceName}/userLogs/${login}/changePassword`,
          {
            rootPath: 'apiv6',
            data: {
              password: newPassword,
            },
          },
        );
      }

      /**
       * Create a user
       * @param {string} serviceName
       * @param {string} description
       * @param {string} login
       * @param {string} password
       */
      userLogsCreate(serviceName, description, login, password) {
        return this.OvhHttp.post(`/hosting/web/${serviceName}/userLogs`, {
          rootPath: 'apiv6',
          data: {
            description,
            login,
            password,
          },
          broadcast: 'hosting.userLogs.refresh',
        });
      }

      /**
       * Update a user
       * @param {string} serviceName
       * @param {string} login
       * @param {string} description
       */
      modifyUserLogs(serviceName, login, description) {
        return this.OvhHttp.put(
          `/hosting/web/${serviceName}/userLogs/${login}`,
          {
            rootPath: 'apiv6',
            data: {
              description,
            },
            broadcast: 'hosting.userLogs.refresh',
          },
        );
      }

      /* -------------------------POLLING-------------------------*/

      /**
       * kept only for CDN v1 purpose, we have to remove it once all customers use CDN v2
       * @param serviceName {String}: product id
       * @param taskIds {Array}: list of tasks ids
       * @returns {Promise}: poll promise
       */
      pollFlushCdn(serviceName, taskIds) {
        return this.$q.all(
          map(taskIds, (taskId) =>
            this.Poll.poll(
              `apiv6/hosting/web/${serviceName}/tasks/${taskId}`,
              null,
              {
                namespace: 'hosting.cdn.flush.refresh',
                interval: 30000,
              },
            ).then(
              (resp) => resp,
              (err) => err,
            ),
          ),
        );
      }

      pollSharedFlushCdn(serviceName, operationIds) {
        return this.$q.all(
          map(operationIds, (operationId) =>
            this.Poll.poll(
              `apiv6/hosting/web/${serviceName}/cdn/operation/${operationId}`,
              null,
              {
                namespace: 'hosting.cdn.flush.refresh',
                interval: 30000,
              },
            ).then(
              (resp) => resp,
              (err) => err,
            ),
          ),
        );
      }

      pollSqlPrive(serviceName, taskIds) {
        return this.$q.all(
          map(taskIds, (taskId) =>
            this.Poll.poll(
              `apiv6/hosting/web/${serviceName}/tasks/${taskId}`,
              null,
              {
                namespace: 'hosting.database.sqlPrive',
                interval: 30000,
              },
            )
              .then((resp) => resp)
              .catch((err) => err),
          ),
        );
      }

      killPollFlushCdn() {
        this.Poll.kill({ namespace: 'hosting.cdn.flush.refresh' });
      }

      pollDatabaseQuotaTask(serviceName, taskId) {
        return this.Poll.poll(
          `apiv6/hosting/web/${serviceName}/tasks/${taskId}`,
        );
      }

      killPollSqlPrive() {
        this.Poll.kill({ namespace: 'hosting.database.sqlPrive' });
      }

      checkTaskUnique(serviceName, fct) {
        let tasks = [];
        const tasksPromises = map(['init', 'doing', 'todo'], (status) =>
          this.$http
            .get(`/hosting/web/${serviceName}/tasks`, {
              params: {
                function: fct,
                status,
              },
            })
            .then((response) => {
              if (isArray(response.data) && !isEmpty(response.data)) {
                tasks = union(tasks, response.data);
              }
            }),
        );

        return this.$q.all(tasksPromises).then(() => tasks);
      }

      checkSharedCdnOperations(serviceName, fct) {
        const statusToCheck = [
          this.HOSTING_OPERATION_STATUS.TODO,
          this.HOSTING_OPERATION_STATUS.DOING,
        ];

        return this.$http
          .get(`/hosting/web/${serviceName}/cdn/operation`)
          .then(({ data: operations }) => {
            return {
              all: operations,
              active: operations.filter(
                (operation) =>
                  operation.function === fct &&
                  statusToCheck.includes(operation.status),
              ),
            };
          });
      }

      /* -------------------------ORDER/HOSTING/WEB-------------------------*/

      /**
       * Get upgrade offer prices
       * @param {string} serviceName
       * @param {string} offer
       */
      getUpgradePrices(serviceName, offer) {
        return this.OvhHttp.get(`/order/hosting/web/${serviceName}/upgrade`, {
          rootPath: 'apiv6',
          params: {
            offer,
          },
        }).then((durations) => {
          const durationsTab = [];
          const defer = this.$q.defer();
          defer.notify(durations);

          const requests = map(durations, (duration) =>
            this.OvhHttp.get(
              `/order/hosting/web/${serviceName}/upgrade/${duration}`,
              {
                rootPath: 'apiv6',
                params: {
                  offer,
                },
              },
            ).then((durationDetails) => {
              const details = angular.copy(durationDetails);
              details.duration = duration;
              durationsTab.push(details);
              defer.notify(durationsTab);
            }),
          );

          this.$q.all(requests).then(
            () => {
              defer.resolve(durationsTab);
            },
            () => {
              defer.resolve(durationsTab);
            },
          );

          return defer.promise;
        });
      }

      /**
       * Order upgraded offer
       * @param {string} serviceName
       * @param {string} offer
       * @param {string} duration
       * @param {string} startTime (optional)
       */
      orderUpgrade(serviceName, offer, duration, startTime = null) {
        return this.OvhHttp.post(
          `/order/hosting/web/${serviceName}/upgrade/${duration}`,
          {
            rootPath: 'apiv6',
            data: {
              offer,
              ...(startTime ? { startTime } : {}),
            },
          },
        );
      }

      /**
       * Terminate hosting service
       * @param {string} serviceName
       */
      terminate(serviceName) {
        return this.OvhHttp.post(`/hosting/web/${serviceName}/terminate`, {
          rootPath: 'apiv6',
          data: {},
        });
      }
    },
  );
}
