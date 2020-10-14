import clone from 'lodash/clone';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import map from 'lodash/map';
import mapKeys from 'lodash/mapKeys';
import orderBy from 'lodash/orderBy';
import size from 'lodash/size';
import some from 'lodash/some';
import split from 'lodash/split';

import { DATABASE_NAMES } from './private-database.constants';

export default class PrivateDatabase {
  /* @ngInject */
  /**
   * Constructor
   * @param $rootScope
   * @param $cacheFactory
   * @param $http
   * @param $q
   * @param $translate
   * @param OvhHttp
   * @param Poll
   */
  constructor($rootScope, $cacheFactory, $http, $q, $translate, OvhHttp, Poll) {
    this.$rootScope = $rootScope;
    this.cach = $cacheFactory;
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.OvhHttp = OvhHttp;
    this.Poll = Poll;

    this.cache = this.cach('UNIVERS_WEB_PRIVATE_DATABASE');
    this.requests = {
      privateDatabaseDetails: null,
    };

    this.swsProxypassPath = 'apiv6/hosting/privateDatabase';
    this.swsProxypassOrderPath = 'apiv6/order/hosting/privateDatabase';

    this.rootPath = 'apiv6';

    this.NBDAYTODELETE = 30;
  }

  /**
   * Private function to reset the cache
   * @param key
   */
  resetCache(key) {
    if (key !== undefined) {
      if (this.requests[key] !== undefined) {
        this.requests[key] = null;
      }
      this.cache.remove(key);
    } else {
      this.cache.removeAll();
      forEach(Object.keys(this.requests), (request) => {
        this.requests[request] = null;
      });
    }
  }

  /**
   * Get order models
   */
  getOrderModels() {
    return this.$http
      .get('apiv6/order.json', { cache: true })
      .then((response) => get(response, 'data.models', {}));
  }

  /**
   * Get sql order capacities
   * @param  {string} offer - "public" for DBaaS or "classic" for sqlPrive
   * @return {object}
   */
  getAvailableOrderCapacities(offer) {
    return this.$http
      .get('apiv6/hosting/privateDatabase/availableOrderCapacities', {
        params: {
          offer,
        },
      })
      .then((res) => res.data);
  }

  getOrderableDatabaseVersions(offer) {
    return this.getAvailableOrderCapacities(offer)
      .then((capabilities) => {
        const versions = capabilities.version;
        return map(versions, (v) => {
          const [name, version] = split(v, '_');
          if (name && DATABASE_NAMES[name]) {
            return {
              id: v,
              label: `${DATABASE_NAMES[name]} ${version}`,
              name: DATABASE_NAMES[name],
              version,
            };
          }
          return {
            id: v,
            label: v,
            name: v,
          };
        });
      })
      .then((versions) =>
        orderBy(versions, ['name', 'version'], ['asc', 'desc']),
      );
  }

  /**
   * Get hosting models
   */
  getModels() {
    return this.OvhHttp.get('/hosting/privateDatabase.json', {
      rootPath: 'apiv6',
    }).then((schema) => schema.models);
  }

  getAvailableVersions(serviceName) {
    return this.$http
      .get(`${this.swsProxypassPath}/${serviceName}/availableVersions`)
      .then((database) => database.data)
      .catch((err) => this.$q.reject(err));
  }

  getHostingsLinked(serviceName) {
    return this.OvhHttp.get('/hosting/privateDatabase/{serviceName}/webs', {
      urlParams: {
        serviceName,
      },
      rootPath: 'apiv6',
    });
  }

  getParentServiceId(serviceName) {
    return this.getServiceInfos(serviceName).then(({ serviceId }) => {
      return this.OvhHttp.get(`/services/${serviceId}`, {
        rootPath: 'apiv6',
      });
    });
  }

  getServiceInfos(dbName) {
    return this.$http
      .get(`apiv6/hosting/privateDatabase/${dbName}/serviceInfos`)
      .then((res) => res.data)
      .catch((err) => this.$q.reject(err.data));
  }

  getSelected(serviceName, forceRefresh) {
    if (forceRefresh) {
      this.resetCache();
    }

    return this.$http
      .get(`${this.swsProxypassPath}/${serviceName}`, { cache: this.cache })
      .then((response) => {
        const database = response.data;
        return this.$http
          .get(`${this.swsProxypassPath}/${serviceName}/serviceInfos`)
          .then((_response) => {
            database.serviceInfos = _response.data;
            return database;
          });
      })
      .then((formerDatabase) => {
        const database = clone(formerDatabase);
        database.capabilities = mapKeys(
          database.capabilities,
          (capability) => capability.object,
        );
        return database;
      })
      .then((formerDatabase) => {
        // we don't have any other certificate types right now
        // and the API doesn't have this field
        const database = clone(formerDatabase);
        database.certificateType = 'TLS CA';
        return database;
      })
      .catch((err) => this.$q.reject(err.data));
  }

  updatePrivateDatabase(serviceName, opts) {
    return this.OvhHttp.put('/hosting/privateDatabase/{serviceName}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      clearAllCache: true,
      data: opts.body,
    });
  }

  getUsers(serviceName) {
    return this.$http
      .get(`${this.swsProxypassPath}/${serviceName}/user`, {
        cache: false,
      })
      .then((reponse) => reponse.data)
      .catch((err) => this.$q.reject(err.data));
  }

  getUser(serviceName, user) {
    return this.OvhHttp.get(
      '/hosting/privateDatabase/{serviceName}/user/{userName}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          userName: this.OvhHttp.encode(user),
        },
      },
    );
  }

  /*
    USER CREATION
    */
  addUser(serviceName, password, userName) {
    this.resetCache();
    return this.$http
      .post(`${this.swsProxypassPath}/${serviceName}/user`, {
        password,
        userName,
      })
      .then(
        (response) => {
          // poll adding
          this.polluserset(serviceName, {
            taskId: response.data.id,
            taskFunction: response.data.function.replace(
              'privateDatabase/',
              '',
            ),
            userName,
          });

          // return task id
          return response.data.id;
        },
        (err) => this.$q.reject(err),
      );
  }

  polluserset(serviceName, opts) {
    const namespace = `privateDatabase.${opts.taskFunction.replace(
      /\//g,
      '.',
    )}`;
    const options = angular.copy(opts);
    options.namespace = namespace;

    return this.poll(serviceName, {
      taskId: opts.taskId,
      namespace,
      userName: opts.userName,
    }).then(
      () => this.usersetSuccess(serviceName, options),
      () => this.usersetError(options),
    );
  }

  usersetSuccess(serviceName, opts) {
    return this.getUser(serviceName, opts.userName).then((user) => {
      this.$rootScope.$broadcast(`${opts.namespace}.done`, user);
    });
  }

  usersetError(opts) {
    this.$rootScope.$broadcast(`${opts.namespace}.error`, opts);
  }

  /*
        USER DELETE
    */
  deleteUser(serviceName, userName) {
    this.resetCache();
    return this.$http
      .delete(
        `${
          this.swsProxypassPath
        }/${serviceName}/user/${window.encodeURIComponent(userName)}`,
      )
      .then((response) => {
        // start poll
        this.polluserdelete(serviceName, {
          taskId: response.data.id,
          taskFunction: response.data.function.replace('privateDatabase/', ''),
          userName,
        });

        // return task id
        return response.data.id;
      })
      .catch((err) => this.$q.reject(err));
  }

  polluserdelete(serviceName, opts) {
    const namespace = `privateDatabase.${opts.taskFunction.replace(
      /\//g,
      '.',
    )}`;
    const options = angular.copy(opts);
    options.namespace = namespace;

    // poll on delete
    return this.poll(serviceName, {
      taskId: opts.taskId,
      userName: opts.userName,
      namespace,
    })
      .then(() => this.userdeleteSuccess(serviceName, options))
      .catch(() => this.userdeleteError(options));
  }

  userdeleteSuccess(serviceName, opts) {
    return this.getUsers(serviceName).then((users) => {
      this.$rootScope.$broadcast(`${opts.namespace}.done`, users);
    }, angular.noop);
  }

  userdeleteError(opts) {
    this.$rootScope.$broadcast(`${opts.namespace}.error`, opts);
  }

  /*
        MANAGE GRANT
    */
  getDatabases(serviceName) {
    return this.$http
      .get(`${this.swsProxypassPath}/${serviceName}/database`)
      .then((res) => res.data);
  }

  getUserGrant(serviceName, userName) {
    return this.$http.get(
      `${this.swsProxypassPath}/${serviceName}/user/${userName}/grant`,
    );
  }

  getUserGrantDatabase(serviceName, userName, grantsBase) {
    return this.$http.get(
      `${this.swsProxypassPath}/${serviceName}/user/${userName}/grant/${grantsBase}`,
    );
  }

  getUserGrants(serviceName, user) {
    const deferred = this.$q.defer();
    let returnGrant;

    // First get databases
    this.getDatabases(serviceName)
      .then((resp) =>
        mapKeys(
          map(resp, (base) => ({
            virgin: true,
            dataBase: base,
            value: 'none',
          })),
          (item) => item.dataBase,
        ),
      )
      .then((grants) => {
        if (!size(grants)) {
          return deferred.reject(grants);
        }
        returnGrant = grants;

        // get all grants
        return this.getUserGrant(serviceName, user);
      })
      .then((response) => response.data)
      .then((data) =>
        this.$q.all(
          map(data, (grantsBase) =>
            this.getUserGrantDatabase(serviceName, user, grantsBase).then(
              (result) => {
                if (returnGrant[grantsBase]) {
                  returnGrant[grantsBase].value = result.data.grant;
                  returnGrant[grantsBase].virgin = false;
                }
                deferred.notify(returnGrant);
              },
            ),
          ),
        ),
      )
      .then(() => deferred.resolve(returnGrant))
      .catch(() => deferred.resolve(returnGrant));

    return deferred.promise;
  }

  setUserGrant(serviceName, base, userName, grant) {
    this.resetCache();

    let suffix = 'grant';
    let dataToSend = {};

    if (!grant.virgin) {
      suffix = `${suffix}/${base}/update`;
      dataToSend = {
        grant: grant.newGrant || grant.value,
      };
    } else {
      dataToSend = {
        databaseName: base,
        grant: grant.newGrant || grant.value,
      };
    }

    return this.$http
      .post(
        `${this.swsProxypassPath}/${serviceName}/user/${userName}/${suffix}`,
        dataToSend,
      )
      .then((response) => {
        this.pollgrantset(serviceName, {
          taskId: response.data.id,
          taskFunction: response.data.function.replace('privateDatabase/', ''),
          userName,
          databaseName: base,
        });

        return response.data.id;
      })
      .catch((err) => this.$q.reject(err.data));
  }

  pollgrantset(serviceName, opts) {
    const namespace = `privateDatabase.${opts.taskFunction
      .replace(/\//g, '.')
      .replace(/\.create|\.update/g, '.set')}`;
    const options = angular.copy(opts);
    options.namespace = namespace;

    return this.poll(serviceName, {
      taskId: opts.taskId,
      userName: opts.userName,
      databaseName: opts.databaseName,
      namespace,
    }).then(
      () => this.grantsetSuccess(serviceName, options),
      () => this.grantsetError(options),
    );
  }

  grantsetSuccess(serviceName, opts) {
    return this.getUserGrants(serviceName, opts.userName).then((grants) => {
      const options = angular.copy(opts);
      options.grants = grants;
      this.$rootScope.$broadcast(`${opts.namespace}.done`, options);
    });
  }

  grantsetError(opts) {
    this.$rootScope.$broadcast(`${opts.namespace}.error`, opts);
  }

  /*
        ORDER
    */
  orderDuration(version, ram) {
    return this.$http
      .get(`${this.swsProxypassOrderPath}/new`, { params: { version, ram } })
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err.data));
  }

  orderPrice(version, ram, duration) {
    return this.$http
      .get(`${this.swsProxypassOrderPath}/new/${duration}`, {
        params: { version, ram },
      })
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err.data));
  }

  orderPrivateDatabase(version, ram, duration, datacenter) {
    return this.$http
      .post(`${this.swsProxypassOrderPath}/new/${duration}`, {
        version,
        ram,
        offer: 'classic',
        datacenter,
      })
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err.data));
  }

  orderDBaaS(version, ram, duration, datacenter) {
    return this.$http
      .post(`${this.swsProxypassOrderPath}/new/${duration}`, {
        version,
        ram,
        offer: 'public',
        datacenter,
      })
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err.data));
  }

  canOrder(serviceName) {
    return this.$http
      .get(this.swsProxypassOrderPath)
      .then(
        (response) =>
          findIndex(response.data, (service) => service === serviceName) !== -1,
      )
      .catch(() => false);
  }

  canOrderRam(serviceName) {
    return this.canOrder(serviceName).then((canOrder) => {
      if (canOrder) {
        return this.getParentServiceId(serviceName).then(
          ({ parentServiceId }) => {
            if (parentServiceId === null) {
              return this.$http
                .get(`${this.swsProxypassOrderPath}/${serviceName}`)
                .then(
                  (response) =>
                    findIndex(
                      response.data,
                      (service) => service === 'ram' || service === 'upgrade',
                    ) !== -1,
                );
            }
            return false;
          },
        );
      }
      return false;
    });
  }

  listAvailableRam() {
    return this.$http
      .get(`apiv6/order.json?d=${Date.now()}`)
      .then((response) => {
        if (get(response, 'data.models', false)) {
          return response.data.models[
            'hosting.PrivateDatabase.AvailableRamSizeEnum'
          ].enum;
        }
        return [];
      })
      .catch(() => []);
  }

  listAvailableRamDurations(serviceName, opts) {
    return this.canOrderRam(serviceName).then((canOrderRam) => {
      let rtn;

      if (canOrderRam) {
        rtn = this.$http
          .get(`${this.swsProxypassOrderPath}/${serviceName}/ram`, {
            params: { ram: opts.ram },
          })
          .then((response) => response.data || [])
          .catch(() => []);
      }

      return rtn;
    });
  }

  getRamPrices(serviceName, opts) {
    const durationsTab = [];
    const defer = this.$q.defer();

    this.listAvailableRamDurations(serviceName, opts)
      .then((durations) => {
        defer.notify(durations);

        return this.$q.all(
          map(durations, (duration) =>
            this.$http
              .get(
                `${this.swsProxypassOrderPath}/${serviceName}/ram/${duration}`,
                {
                  params: {
                    ram: opts.ram,
                  },
                },
              )
              .then((durationDetails) => {
                const details = angular.copy(durationDetails.data);
                details.duration = duration;
                durationsTab.push(details);
                defer.notify(durationsTab);
              }),
          ),
        );
      })
      .then(() => defer.resolve(durationsTab))
      .catch(() => defer.resolve(durationsTab));
    return defer.promise;
  }

  orderRamorderRam(serviceName, ram, duration) {
    return this.$http
      .post(`${this.swsProxypassOrderPath}/${serviceName}/ram/${duration}`, {
        ram,
      })
      .then((res) => res.data);
  }

  orderRam(serviceName, ram, duration) {
    return this.$http
      .post(`${this.swsProxypassOrderPath}/${serviceName}/ram/${duration}`, {
        ram,
      })
      .then((response) => response.data);
  }

  /*
        ACTIONS
    */
  changePassword(serviceName, password, user, passwordType) {
    const actionType =
      !passwordType || passwordType === 'root'
        ? 'changeRootPassword'
        : 'changeFtpPassword';
    const action =
      user !== null ? `user/${user.userName}/changePassword` : actionType;

    return this.$http
      .post(`${this.swsProxypassPath}/${serviceName}/${action}`, { password })
      .then((response) => {
        if (user) {
          this.polluserchangePassword(serviceName, {
            taskId: response.data.id,
            taskFunction: response.data.function.replace(
              'privateDatabase/',
              '',
            ),
            userName: user.userName,
          });
        }
        return response.data.id;
      })
      .catch((err) => this.$q.reject(err));
  }

  polluserchangePassword(serviceName, opts) {
    const namespace = `privateDatabase.${opts.taskFunction.replace(
      /\//g,
      '.',
    )}`;
    const options = angular.copy(opts);
    options.namespace = namespace;

    return this.poll(serviceName, {
      taskId: opts.taskId,
      userName: opts.userName,
      databaseName: opts.databaseName,
      namespace,
    })
      .then(() => {
        this.userchangePasswordSuccess(options);
      })
      .catch(() => {
        this.userchangePasswordError(options);
      });
  }

  userchangePasswordSuccess(opts) {
    this.$rootScope.$broadcast(`${opts.namespace}.done`, opts);
  }

  userchangePasswordError(opts) {
    this.$rootScope.$broadcast(`${opts.namespace}.error`, opts);
  }

  changeVersion(serviceName, version) {
    return this.$http
      .post(`${this.swsProxypassPath}/${serviceName}/changeVersion`, {
        version,
      })
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err));
  }

  refreshDatabase(serviceName) {
    return this.$http
      .post(`${this.swsProxypassPath}/${serviceName}/refresh`)
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err));
  }

  restartDatabase(serviceName) {
    return this.$http
      .post(`${this.swsProxypassPath}/${serviceName}/restart`)
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err));
  }

  startDatabase(serviceName) {
    return this.$http
      .post(`${this.swsProxypassPath}/${serviceName}/start`)
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err));
  }

  stopDatabase(serviceName) {
    return this.$http
      .post(`${this.swsProxypassPath}/${serviceName}/stop`)
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err));
  }

  getTasks(serviceName) {
    return this.$http
      .get(`${this.swsProxypassPath}/${serviceName}/tasks`)
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err));
  }

  getTasksFiltered(serviceName, type, status) {
    return this.$http
      .get(`${this.swsProxypassPath}/${serviceName}/tasks`, {
        params: {
          status,
          function: type,
        },
      })
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err));
  }

  getTaskDetails(serviceName, tasksId) {
    return this.$http
      .get(`${this.swsProxypassPath}/${serviceName}/tasks/${tasksId}`)
      .then((response) => response.data)
      .catch((err) => err.data);
  }

  getTasksWithStatus(serviceName, status) {
    return this.$http
      .get(`${this.swsProxypassPath}/${serviceName}/tasks`, {
        status,
      })
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err));
  }

  getTasksToPoll(serviceName, filters) {
    let tasks = [];
    let filteredTask = [];
    const defer = this.$q.defer();

    const doFilter = () => {
      if (filters) {
        filteredTask = filter(tasks, (task) => some(filters, task.function));
      } else {
        filteredTask = tasks;
      }
      defer.resolve(filteredTask);
    };

    this.$q.all(
      map(['init', 'doing', 'todo'], (status) =>
        this.getTasksWithStatus(serviceName, status)
          .then((response) =>
            map(response, (tasksId) =>
              this.getTaskDetails(serviceName, tasksId),
            ),
          )
          .then((requests) => {
            tasks = filter(requests, (request) => get(request, 'data'));
          })
          .then(doFilter())
          .catch(doFilter()),
      ),
    );
    return defer.promise;
  }

  restartPoll(filters) {
    this.getTasksToPoll(filters).then((tasks) => {
      forEach(tasks, (task) => {
        let namespace = `privateDatabase.${task.function.replace(/\//g, '.')}`;
        namespace = namespace.replace(/\.create|\.update/g, '.set');

        this[
          `poll${namespace.replace('privateDatabase.', '').replace('.', '')}`
        ]({
          taskId: task.id,
          taskFunction: task.function,
          userName: task.userName,
          databaseName: task.databaseName,
          whitelist: task.whitelist,
          extension: task.extension,
          namespace,
        });
      });
    });
  }

  poll(serviceName, opts) {
    // broadcast start with opts
    this.$rootScope.$broadcast(`${opts.namespace}.start`, opts);

    // do poll
    return this.Poll.poll(
      `${this.swsProxypassPath}/${serviceName}/tasks/${opts.taskId}`,
      null,
      {
        namespace: opts.namespace,
      },
    ).then(
      (response) => {
        this.resetCache();
        return response;
      },
      (err) => this.$q.reject(err),
    );
  }

  killPollAction() {
    this.Poll.kill({ namespace: 'privateDatabase.global.actions' });
  }

  killPollUserGrant() {
    this.Poll.kill({ namespace: 'privateDatabase.user.grant.set' });
  }

  killPollUserChangePassword() {
    this.Poll.kill({ namespace: 'privateDatabase.user.changePassword' });
  }

  killPollUserDelete() {
    this.Poll.kill({ namespace: 'privateDatabase.user.delete' });
  }

  killPollUserCreate() {
    this.Poll.kill({ namespace: 'privateDatabase.user.create' });
  }

  /**
   * Get all database Id
   * @param  {string}  serviceName [description]
   * @return {string[]}              [description]
   */
  getBDDSId(serviceName) {
    return this.$http
      .get(`${this.swsProxypassPath}/${serviceName}/database`)
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err.data));
  }

  getBDDS(serviceName, forceRefresh) {
    const defer = this.$q.defer();
    const bddsTab = [];

    if (forceRefresh) {
      this.resetCache();
    }

    this.getBDDSId(serviceName)
      .then((response) =>
        this.$q
          .all(
            map(response, (bdd) =>
              this.getBDD(serviceName, bdd).then((BDD) => {
                bddsTab.push(BDD);
                defer.notify(bddsTab);
              }),
            ),
          )
          .then(() => defer.resolve(bddsTab))
          .catch(() => defer.resolve(bddsTab)),
      )
      .catch((err) => this.$q.reject(err.data));

    return defer.promise;
  }

  getBDD(serviceName, bdd) {
    return this.$http
      .get(`${this.swsProxypassPath}/${serviceName}/database/${bdd}`)
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err.data));
  }

  deleteBDD(serviceName, databaseName) {
    return this.$http
      .delete(
        `${this.swsProxypassPath}/${serviceName}/database/${databaseName}`,
      )
      .then((response) => {
        this.polldatabasedelete(serviceName, {
          taskId: response.data.id,
          taskFunction: response.data.function.replace('privateDatabase/', ''),
          databaseName,
        });
        return response.data.id;
      })
      .catch((err) => this.$q.reject(err.data));
  }

  polldatabasedelete(serviceName, opts) {
    const namespace = `privateDatabase.${opts.taskFunction.replace(
      /\//g,
      '.',
    )}`;
    const options = angular.copy(opts);
    options.namespace = namespace;

    return this.poll(serviceName, {
      taskId: opts.taskId,
      databaseName: opts.databaseName,
      namespace,
    })
      .then(() => {
        this.databasedeleteSuccess(serviceName, options);
      })
      .catch(() => {
        this.databasedeleteError(options);
      });
  }

  databasedeleteSuccess(serviceName, opts) {
    return this.getBDDS(serviceName).then((bdds) => {
      const options = angular.copy(opts);
      options.bdds = bdds;
      this.$rootScope.$broadcast(`${opts.namespace}.done`, options);
    });
  }

  databasedeleteError(opts) {
    this.$rootScope.$broadcast(`${opts.namespace}.error`, opts);
  }

  addBdd(serviceName, databaseName) {
    this.resetCache();

    return this.$http
      .post(`${this.swsProxypassPath}/${serviceName}/database`, {
        databaseName,
      })
      .then((response) => {
        this.polldatabaseset(serviceName, {
          taskId: response.data.id,
          taskFunction: response.data.function,
          databaseName,
        });
        return response.data.id;
      })
      .catch((err) => this.$q.reject(err));
  }

  addBddWizard(serviceName, database) {
    this.resetCache();

    return this.$http
      .post(`${this.swsProxypassPath}/${serviceName}/databaseWizard`, database)
      .then((response) => {
        this.polldatabaseset(serviceName, {
          taskId: response.data.id,
          taskFunction: response.data.function,
          databaseName: database.databaseName,
        });
        return response.data.id;
      })
      .catch((err) => this.$q.reject(err));
  }

  polldatabaseset(serviceName, opts) {
    const options = angular.copy(opts);
    options.namespace = `privateDatabase.${opts.taskFunction.replace(
      /\//g,
      '.',
    )}`;

    return this.poll(serviceName, {
      taskId: opts.taskId,
      namespace: options.namespace,
      databaseName: opts.databaseName,
    }).then(
      () => this.databasesetSuccess(serviceName, options),
      () => this.databasesetError(options),
    );
  }

  databasesetSuccess(serviceName, opts) {
    return this.getBDD(serviceName, opts.databaseName).then((database) => {
      this.$rootScope.$broadcast(`${opts.namespace}.done`, database);
    });
  }

  databasesetError(opts) {
    this.$rootScope.$broadcast(`${opts.namespace}.error`, opts);
  }

  getDumpsBDD(serviceName, databaseName) {
    return this.$http
      .get(
        `${this.swsProxypassPath}/${serviceName}/database/${databaseName}/dump`,
      )
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err.data));
  }

  /**
   * Get all dumps id
   * @param  {string}  serviceName
   * @param  {Boolean} isOrphan
   * @return {string[]}
   */
  getDumps(serviceName, isOrphan) {
    return this.$http
      .get(`${this.swsProxypassPath}/${serviceName}/dump`, {
        params: { orphan: isOrphan },
      })
      .then((res) => res.data)
      .catch((err) => this.$q.reject(err.data));
  }

  getDumpBDD(serviceName, databaseName, dumpId) {
    return this.$http
      .get(
        `${this.swsProxypassPath}/${serviceName}/database/${databaseName}/dump/${dumpId}`,
      )
      .then((response) => response.data)
      .catch((err) => this.$q.reject(err.data));
  }

  getDump(serviceName, dumpId) {
    return this.$http
      .get(`${this.swsProxypassPath}/${serviceName}/dump/${dumpId}`)
      .then((res) => res.data)
      .catch((err) => this.$q.reject(err.data));
  }

  dumpBDD(serviceName, databaseName, sendEmail) {
    return this.$http
      .post(
        `${this.swsProxypassPath}/${serviceName}/database/${databaseName}/dump`,
        {
          sendEmail,
        },
      )
      .then((response) => {
        this.polldatabasedump(serviceName, {
          taskId: response.data.id,
          taskFunction: response.data.function.replace('privateDatabase/', ''),
          databaseName,
        });
        return response.data.id;
      })
      .catch((err) => this.$q.reject(err.data));
  }

  polldatabasedump(serviceName, opts) {
    const namespace = `privateDatabase.${opts.taskFunction.replace(
      /\//g,
      '.',
    )}`;
    const options = angular.copy(opts);
    options.namespace = namespace;

    return this.poll(serviceName, {
      taskId: opts.taskId,
      databaseName: opts.databaseName,
      namespace,
    })
      .then(() => {
        this.databasedumpsuccess(options);
      })
      .catch(() => {
        this.databasedumperror(options);
      });
  }

  databasedumpsuccess(opts) {
    this.$rootScope.$broadcast(`${opts.namespace}.done`, opts);
  }

  databasedumperror(opts) {
    this.$rootScope.$broadcast(`${opts.namespace}.error`, opts);
  }

  restoreBDD(serviceName, databaseName, dumpId) {
    return this.$http
      .post(
        `${this.swsProxypassPath}/${serviceName}/database/${databaseName}/dump/${dumpId}/restore`,
      )
      .then((response) => {
        this.pollDatabaseRestore(serviceName, {
          taskId: response.data.id,
          taskFunction: response.data.function.replace('privateDatabase/', ''),
          databaseName,
          dumpId,
        });

        return response.data.id;
      })
      .catch((err) => this.$q.reject(err.data));
  }

  importDatabase(serviceName, db, documentId, flushDatabase, sendEmail) {
    return this.$http
      .post(`${this.swsProxypassPath}/${serviceName}/database/${db}/import`, {
        documentId,
        flushDatabase,
        sendEmail,
      })
      .then((response) => response.data);
  }

  pollDatabaseRestore(serviceName, opts) {
    const namespace = `privateDatabase.${opts.taskFunction.replace(
      /\//g,
      '.',
    )}`;
    const options = angular.copy(opts);
    options.namespace = namespace;

    return this.poll(serviceName, {
      taskId: opts.taskId,
      databaseName: opts.databaseName,
      namespace,
      dumpId: opts.dumpId,
    })
      .then(() => {
        this.databaseRestoreSuccess(options);
      })
      .catch(() => {
        this.databaseRestoreError(options);
      });
  }

  databaseRestoreSuccess(opts) {
    this.$rootScope.$broadcast(`${opts.namespace}.done`, opts);
  }

  restoreBDDNoBDD(serviceName, databaseName, dumpId) {
    return this.OvhHttp.post(
      '/hosting/privateDatabase/{serviceName}/dump/{dumpId}/restore',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          dumpId,
        },
        data: {
          databaseName,
        },
      },
    )
      .then((resp) => {
        this.pollDatabaseRestore(serviceName, {
          taskId: resp.id,
          taskFunction: resp.function.replace('privateDatabase/', ''),
          databaseName,
          dumpId,
        });

        return resp.id;
      })
      .catch((err) => this.$q.reject(err));
  }

  databaseRestoreError(opts) {
    this.$rootScope.$broadcast(`${opts.namespace}.error`, opts);
  }

  killPollRestore() {
    this.Poll.kill({ namespace: 'privateDatabase.database.restore' });
  }

  deleteDumpBDD(serviceName, databaseName, dumpId) {
    return this.$http
      .delete(
        `${this.swsProxypassPath}/${serviceName}/database/${databaseName}/dump/${dumpId}`,
      )
      .then((response) => {
        this.pollDatabaseDumpDelete(serviceName, {
          taskId: response.data.id,
          taskFunction: response.data.function.replace('privateDatabase/', ''),
          databaseName,
        });
        return response.data.id;
      })
      .catch((err) => this.$q.reject(err.data));
  }

  pollDatabaseDumpDelete(serviceName, opts) {
    const namespace = `privateDatabase.${opts.taskFunction.replace(
      /\//g,
      '.',
    )}`;
    const options = angular.copy(opts);
    options.namespace = namespace;

    return this.poll(serviceName, {
      taskId: opts.taskId,
      databaseName: opts.databaseName,
      namespace,
    })
      .then(() => {
        this.$rootScope.$broadcast(`${opts.namespace}.done`, opts);
      })
      .catch(() => {
        this.$rootScope.$broadcast(`${opts.namespace}.error`, opts);
      });
  }

  getConfigurationDetails(serviceName) {
    return this.OvhHttp.get('/hosting/privateDatabase/{serviceName}/config', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  }

  changeConfigurationDetails(serviceName, data) {
    return this.OvhHttp.post(
      '/hosting/privateDatabase/{serviceName}/config/update',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data,
      },
    );
  }

  pollConfigurationChange(serviceName) {
    const namespace = 'privateDatabase.configuration.change';
    return this.getTasksFiltered(
      serviceName,
      encodeURI('configuration/update'),
      'todo',
    ).then((tasks) => {
      if (tasks.length) {
        return this.poll(serviceName, { taskId: tasks[0], namespace });
      }
      return null;
    });
  }

  static getStartTime(range) {
    switch (range) {
      case 'DAY':
        return moment()
          .subtract(1, 'days')
          .valueOf();
      case 'WEEK':
        return moment()
          .subtract(1, 'weeks')
          .valueOf();
      case 'MONTH':
        return moment()
          .subtract(1, 'months')
          .valueOf();
      default:
        return moment()
          .subtract(1, 'days')
          .valueOf();
    }
  }

  static getDownSample(range) {
    switch (range) {
      case 'DAY':
        return '1m-avg';
      case 'WEEK':
        return '1800s-avg';
      case 'MONTH':
        return '7200s-avg';
      default:
        return '1800s-avg';
    }
  }

  getGraphData(opts) {
    const downSample = this.constructor.getDownSample(opts.range);

    return this.$http({
      method: 'POST',
      serviceType: 'opentsdb',
      url: [opts.graphEndpoint.host, 'api/query'].join('/'),
      headers: {
        Authorization: `Basic ${btoa(
          `privatedatabase:${opts.graphEndpoint.readToken}`,
        )}`,
      },
      data: JSON.stringify({
        start: this.constructor.getStartTime(opts.range),
        queries: [
          {
            metric: 'dbaas.metrics.docker_container_mem_usage_percent',
            aggregator: 'sum',
            downsample: downSample,
          },
          {
            metric: 'dbaas.metrics.mysql_connexion_count',
            aggregator: 'sum',
            downsample: downSample,
          },
          {
            metric: 'dbaas.metrics.mysql_query_time_average',
            aggregator: 'sum',
            downsample: downSample,
          },
        ],
      }),
    }).then((response) => response.data);
  }

  static getGraphConfig(titleX, titleY) {
    return angular.copy({
      options: {
        chart: { type: 'line', zoomType: 'x' },
        exporting: { enabled: false },
        tooltip: {
          style: {
            padding: 10,
            fontWeight: 'bold',
          },
          valueDecimals: 0,
        },
        plotOptions: {
          series: {
            marker: {
              enabled: false,
            },
          },
          lines: {
            marker: {
              enabled: false,
            },
          },
        },
      },

      // Series object
      series: [],
      title: {
        text: '',
      },
      loading: false,
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: titleY,
        },
        min: 0,
      },
    });
  }

  getDatabaseDisplayName(keyToTranslate, dbParam) {
    if (dbParam && typeof dbParam === 'string') {
      const [type, versionNumber] = dbParam.split('_');
      return this.$translate.instant(keyToTranslate.concat(type), {
        version: versionNumber,
      });
    }
    if (dbParam && typeof dbParam === 'object') {
      return this.$translate.instant(keyToTranslate.concat(dbParam.type), {
        version: dbParam.versionNumber,
      });
    }

    return null;
  }
}
