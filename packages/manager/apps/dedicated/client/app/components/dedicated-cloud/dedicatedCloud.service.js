import assign from 'lodash/assign';
import camelCase from 'lodash/camelCase';
import flatten from 'lodash/flatten';
import includes from 'lodash/includes';
import indexOf from 'lodash/indexOf';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import set from 'lodash/set';
import snakeCase from 'lodash/snakeCase';
import some from 'lodash/some';

import {
  DEDICATED_CLOUD_CONSTANTS,
  UNAVAILABLE_PCC_CODE,
  VCD_GUIDE_LINKS,
  VCD_SERVICE_PACK_PRICING_MODE,
  TASK_STATUS,
} from './dedicatedCloud.constant';

import { VM_ENCRYPTION_KMS } from './security/dedicatedCloud-security.constants';
import VCDMigrationState from './vcdMigrationState.class';
import PCCMigrationState from './pccMigrationState.class';
import IcebergUtilsService from '../../icebergUtils.services';

const moduleName = 'ovhManagerPccService';

class DedicatedCloudService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $cacheFactory,
    $rootScope,
    icebergUtils,
    OvhApiDedicatedCloud,
    OvhHttp,
    Poll,
    Poller,
    coreConfig,
    ovhFeatureFlipping,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.icebergUtils = icebergUtils;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.OvhHttp = OvhHttp;
    this.Poll = Poll;
    this.Poller = Poller;
    this.coreConfig = coreConfig;
    this.ovhFeatureFlipping = ovhFeatureFlipping;

    this.dedicatedCloudCache = {
      all: 'UNIVERS_DEDICATED_CLOUD',
      datacenters: $cacheFactory('UNIVERS_DEDICATED_CLOUD_DATACENTERS'),
      user: $cacheFactory('UNIVERS_DEDICATED_CLOUD_USER'),
      security: 'UNIVERS_DEDICATED_CLOUD_SECURITY',
      price: $cacheFactory('UNIVERS_DEDICATED_CLOUD_PRICE'),
      subdatacenters: $cacheFactory('UNIVERS_DEDICATED_CLOUD_SUB_DATACENTERS'),
      subdatacentersveeam: $cacheFactory(
        'UNIVERS_DEDICATED_CLOUD_SUB_DATACENTERS_VEEAM',
      ),
      subdatacenterslicences: $cacheFactory(
        'UNIVERS_DEDICATED_CLOUD_SUB_DATACENTERS_LICENCES',
      ),
    };
    this.availableOptions = flatten([
      'nsx',
      'vrops',
      DEDICATED_CLOUD_CONSTANTS.securityOptions,
    ]);
  }

  /* ------- INFORMATIONS -------*/
  getAllPccs() {
    return this.OvhApiDedicatedCloud.v6()
      .query()
      .$promise.then((pccIds) =>
        this.$q.all(
          pccIds.map((pccId) =>
            this.OvhApiDedicatedCloud.v6()
              .get({
                serviceName: pccId,
              })
              .$promise.catch((error) =>
                UNAVAILABLE_PCC_CODE.includes(error.status)
                  ? undefined
                  : this.$q.reject(error),
              ),
          ),
        ),
      );
  }

  getSelected(serviceName, forceRefresh) {
    return this.OvhHttp.get('/sws/dedicatedCloud/{serviceName}', {
      rootPath: '2api',
      urlParams: {
        serviceName,
      },
      cache: this.dedicatedCloudCache.all,
      clearAllCache: forceRefresh,
    }).then((service) =>
      isString(service) || service.status === 'expired'
        ? {
            ...(isObject(service) ? service : undefined),
            isExpired: true,
          }
        : {
            ...service,
            isExpired: false,
          },
    );
  }

  getDescription(serviceName) {
    return this.OvhHttp.get('/dedicatedCloud/{serviceName}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  }

  updateDescription(serviceName, description) {
    return this.OvhHttp.put('/dedicatedCloud/{serviceName}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data: {
        description,
      },
      broadcast: 'global_display_name_change',
      broadcastParam: {
        serviceName,
        displayName: description,
      },
      clearAllCache: this.dedicatedCloudCache.all,
    });
  }

  /* ------- DATACENTER -------*/

  getDatacenters(serviceName) {
    return this.icebergUtils
      .icebergQuery(`/dedicatedCloud/${serviceName}/datacenter`, {})
      .then(({ data }) =>
        data.map((datacenter) => ({
          ...datacenter,
          displayName: punycode.toUnicode(datacenter.name),
          id: datacenter.datacenterId,
        })),
      );
  }

  getDatacentersInformations(serviceName, elementsByPage, elementsToSkip) {
    return this.OvhHttp.get('/sws/dedicatedCloud/{serviceName}/datacenters', {
      rootPath: '2api',
      urlParams: {
        serviceName,
      },
      params: {
        count: elementsByPage,
        offset: elementsToSkip,
      },
    });
  }

  getOrderableHostsProfiles(serviceName, location, datacenterId) {
    return this.OvhHttp.get(
      '/sws/dedicatedCloud/{serviceName}/hostprofiles/{location}/{datacenterId}',
      {
        rootPath: '2api',
        urlParams: {
          serviceName,
          location,
          datacenterId,
        },
      },
    );
  }

  getOrderableDatastoresProfiles(serviceName, location, datacenterId) {
    return this.OvhHttp.get(
      '/sws/dedicatedCloud/{serviceName}/datastoreprofiles/{location}/{datacenterId}',
      {
        rootPath: '2api',
        urlParams: {
          serviceName,
          location,
          datacenterId,
        },
      },
    );
  }

  getMonthlyHostOrder(serviceName, datacenterId, name, quantity) {
    return this.OvhHttp.get(
      '/order/dedicatedCloud/{serviceName}/host/{duration}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          duration: '01',
        },
        params: {
          name,
          datacenterId,
          quantity,
        },
      },
    );
  }

  getMonthlyDatastoreOrder(serviceName, datacenterId, name, quantity) {
    return this.OvhHttp.get(
      '/order/dedicatedCloud/{serviceName}/filer/{duration}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          duration: '01',
        },
        params: {
          name,
          datacenterId,
          quantity,
        },
      },
    );
  }

  orderHosts(serviceName, datacenterId, name, quantity) {
    return this.OvhHttp.post(
      '/order/dedicatedCloud/{serviceName}/host/{duration}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          duration: '01',
        },
        data: {
          name,
          datacenterId,
          quantity,
        },
      },
    );
  }

  orderDatastores(serviceName, datacenterId, name, quantity) {
    return this.OvhHttp.post(
      '/order/dedicatedCloud/{serviceName}/filer/{duration}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          duration: '01',
        },
        data: {
          datacenterId,
          name,
          quantity,
        },
      },
    );
  }

  getCommercialRangeList(serviceName) {
    return this.OvhHttp.get(
      '/dedicatedCloud/{serviceName}/commercialRange/orderable',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      },
    );
  }

  getCommercialRangeCompliance(serviceName) {
    return this.OvhHttp.get(
      '/dedicatedCloud/{serviceName}/commercialRange/compliance',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      },
    );
  }

  getCartServiceOption(serviceName) {
    return this.$http
      .get(`/order/cartServiceOption/privateCloud/${serviceName}`)
      .then(({ data }) => data);
  }

  addDatacenter(serviceName, commercialRangeName) {
    return this.OvhHttp.post('/dedicatedCloud/{serviceName}/datacenter', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data: {
        commercialRangeName,
      },
    });
  }

  deleteDatacenter(serviceName, datacenterId) {
    return this.OvhHttp.delete(
      '/dedicatedCloud/{serviceName}/datacenter/{datacenterId}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          datacenterId,
        },
      },
    );
  }

  /* ------- SUB DATACENTER -------*/

  getDatacenterInfoProxy(serviceName, datacenterId) {
    return this.OvhHttp.get(
      '/dedicatedCloud/{serviceName}/datacenter/{datacenterId}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          datacenterId,
        },
      },
    );
  }

  getDatacenterInfoVm(serviceName, datacenterId, params = {}) {
    return this.icebergUtils.icebergQuery(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm`,
      params,
    );
  }

  getDatacenterInfoVmLicensed(serviceName, datacenterId, params = {}) {
    return this.icebergUtils.icebergQuery(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vmLicensed`,
      params,
    );
  }

  getDatacenterInfoNsxt(serviceName, datacenterId, params = {}) {
    return this.icebergUtils
      .icebergQuery(
        `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/nsxtEdge`,
        params,
      )
      .then(({ data }) => data.filter((item) => item !== null));
  }

  getDatacenterNsxtOptionState(serviceName) {
    return this.$http
      .get('/services', {
        params: { resourceName: `${serviceName}/option/edgensxt` },
      })
      .catch(() => ({ data: [] }))
      .then(({ data }) => ({ enabled: !!data?.length }));
  }

  getDatacenterPendingResizeNsxTask(serviceName, datacenterId, params = {}) {
    return this.icebergUtils
      .icebergQuery(
        `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/task`,
        params,
        {
          name: 'resizeNsxtEdgeCluster',
        },
      )
      .then(({ data }) =>
        data.filter(
          (item) =>
            item.state !== TASK_STATUS.DONE &&
            item.state !== TASK_STATUS.ERROR &&
            item.state !== TASK_STATUS.CANCELED,
        ),
      );
  }

  getDatacenterPendingRemoveNsxTask(serviceName, datacenterId, params = {}) {
    return this.icebergUtils
      .icebergQuery(
        `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/task`,
        params,
        {
          name: 'removeNsxtEdgeOnDc',
        },
      )
      .then(({ data }) =>
        data.filter((item) => item.state === TASK_STATUS.DOING),
      );
  }

  datacenterResizeNsxTaskPoller(serviceName, taskId) {
    return this.Poller.poll(
      `/dedicatedCloud/${serviceName}/task/${taskId}`,
      null,
      {
        method: 'get',
        namespace: taskId,
        interval: 3000,
        successRule: (taskResult) => taskResult.state === TASK_STATUS.DONE,
        errorRule: (taskResult) => taskResult.state === TASK_STATUS.ERROR,
      },
    );
  }

  stopResizeNsxTaskPoller(taskId) {
    return this.Poller.kill({ namespace: taskId });
  }

  getDatacenterNsxtEdgesScalingCapabilities(serviceName, datacenterId) {
    return this.$http.get(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/nsxtEdgesResizingCapabilities`,
    );
  }

  resizeNsxtEdgeCluster(serviceName, datacenterId, size) {
    return this.$http.post(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/resizeNsxtEdgeCluster`,
      { size },
    );
  }

  getDatacenterInformations(serviceName, datacenterId) {
    return this.$http
      .get(`/sws/dedicatedCloud/${serviceName}/datacenters/${datacenterId}`, {
        serviceType: 'aapi',
      })
      .then(({ data }) => data);
  }

  updateDatacenterData(serviceName, datacenterId, data) {
    return this.$http
      .put(`/dedicatedCloud/${serviceName}/datacenter/${datacenterId}`, data)
      .then(({ data: result }) => result);
  }

  /* ------- SUB DATACENTER HOSTS -------*/

  getHosts(serviceName, datacenterId) {
    return this.OvhHttp.get(
      '/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/host',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          datacenterId,
        },
      },
    );
  }

  getHost(serviceName, datacenterId, hostId) {
    return this.OvhHttp.get(
      '/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/host/{hostId}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          datacenterId,
          hostId,
        },
      },
    );
  }

  getHostPrice(
    commercialRange,
    commercialSubRange,
    location,
    billingType,
    hostProfile,
  ) {
    if (this.constructor.hostHasNoPrice(billingType)) {
      return this.$q.when({});
    }
    return this.OvhHttp.get(
      '/price/dedicatedCloud/{commercialRange}/{location}/{commercialSubRange}/host/{billingType}/{hostProfile}',
      {
        rootPath: 'apiv6',
        urlParams: {
          commercialRange,
          location,
          commercialSubRange,
          billingType,
          hostProfile,
        },
        cache: 'UNIVERS_DEDICATED_DEDICATED_CLOUD_PRICE',
      },
    );
  }

  static hostHasNoPrice(billingType) {
    return billingType === 'freeSpare';
  }

  /* ------- SUB DATACENTER LICENCES -------*/

  getDatacenterLicence(serviceName, serviceUsesLegacyOrder) {
    if (!serviceUsesLegacyOrder) {
      return this.OvhHttp.get('/dedicatedCloud/{serviceName}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      }).then((pcc) => ({
        canOrderSpla: !pcc.spla,
        isSplaActive: pcc.spla,
      }));
    }
    return this.$q
      .all({
        pcc: this.OvhHttp.get('/dedicatedCloud/{serviceName}', {
          rootPath: 'apiv6',
          urlParams: {
            serviceName,
          },
        }),
        order: this.OvhHttp.get('/order/dedicatedCloud/{serviceName}', {
          rootPath: 'apiv6',
          urlParams: {
            serviceName,
          },
        }),
      })
      .then((data) => ({
        canOrderSpla: data.order.indexOf('spla') !== -1,
        isSplaActive: data.pcc.spla,
      }))
      .catch((err) =>
        this.$q.reject({
          canOrderSpla: false,
          isSplaActive: false,
          messages: Array.isArray(err) ? err : [err],
          state: 'ERROR',
        }),
      );
  }

  getSplaOrder(serviceName) {
    return this.OvhHttp.get('/order/dedicatedCloud/{serviceName}/spla', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  }

  postSplaOrder(serviceName) {
    return this.OvhHttp.post('/order/dedicatedCloud/{serviceName}/spla', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  }

  /* ------- IAM -------*/

  getIamStatus(serviceName) {
    return this.$http
      .get(`/dedicatedCloud/${serviceName}/iam`)
      .then(({ data }) => data);
  }

  isIamTogglable(serviceName, state) {
    const endpoint = `canBe${state === 'enabled' ? 'Disabled' : 'Enabled'}`;

    return this.$http
      .get(`/dedicatedCloud/${serviceName}/iam/${endpoint}`)
      .then(() => true);
  }

  enableIam(serviceName, params) {
    return this.$http
      .post(`/dedicatedCloud/${serviceName}/iam/enable`, params)
      .then(({ data }) => data);
  }

  disableIam(serviceName, params) {
    return this.$http
      .post(`/dedicatedCloud/${serviceName}/iam/disable`, params)
      .then(({ data }) => data);
  }

  addIamRole(serviceName, name) {
    return this.$http
      .post(`/dedicatedCloud/${serviceName}/iam/addRole`, {
        name,
      })
      .then(({ data }) => data);
  }

  /* ------- USER -------*/

  getUserDetails(serviceName, params = {}) {
    return this.icebergUtils.icebergQuery(
      `/dedicatedCloud/${serviceName}/user`,
      params,
    );
  }

  getUsers(serviceName, name) {
    return this.OvhHttp.get('/dedicatedCloud/{serviceName}/user', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      params: {
        name,
      },
    });
  }

  getUserDetail(serviceName, userId) {
    return this.OvhHttp.get('/dedicatedCloud/{serviceName}/user/{userId}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
        userId,
      },
    });
  }

  addUser(serviceName, user) {
    return this.OvhHttp.post('/dedicatedCloud/{serviceName}/user', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data: {
        name: user.name,
        right: user.right,
        email: user.email,
        password: user.password,
      },
    });
  }

  resetUserPassword(serviceName, user, password) {
    return this.OvhHttp.post(
      '/dedicatedCloud/{serviceName}/user/{userId}/changePassword',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          userId: user.userId,
        },
        data: {
          password,
        },
      },
    ).then((task) => {
      this.pollUserTasks(serviceName, {
        namespace: 'dedicatedCloud.password.update.poll',
        task,
        user,
        successSates: [TASK_STATUS.CANCELED, TASK_STATUS.DONE],
        errorsSates: [TASK_STATUS.ERROR],
      });
    });
  }

  deleteUser(serviceName, userId) {
    return this.OvhHttp.delete('/dedicatedCloud/{serviceName}/user/{userId}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
        userId,
      },
    });
  }

  enableUser(serviceName, userId) {
    return this.OvhHttp.post(
      '/dedicatedCloud/{serviceName}/user/{userId}/enable',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          userId,
        },
      },
    ).then((task) => {
      return this.pollRequestState({
        serviceName,
        task,
        namespace: 'enableUser',
      });
    });
  }

  disableUser(serviceName, userId) {
    return this.OvhHttp.post(
      '/dedicatedCloud/{serviceName}/user/{userId}/disable',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          userId,
        },
      },
    ).then((task) => {
      return this.pollRequestState({
        serviceName,
        task,
        namespace: 'disableUser',
      });
    });
  }

  getUserRights(serviceName, userId, elementsByPage, elementsToSkip) {
    return this.OvhHttp.get(
      '/sws/dedicatedCloud/{serviceName}/users/{userId}/rights',
      {
        rootPath: '2api',
        urlParams: {
          serviceName,
          userId,
        },
        params: {
          count: elementsByPage,
          offset: elementsToSkip,
        },
      },
    );
  }

  setUserRights(serviceName, userId, right) {
    return this.OvhHttp.put(
      '/dedicatedCloud/{serviceName}/user/{userId}/right/{rightId}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          userId,
          rightId: right.rightId,
        },
        data: {
          right: camelCase(right.right),
          canAddRessource: right.canAddRessource,
          vmNetworkRole: camelCase(right.vmNetworkRole),
          networkRole: camelCase(right.networkRole),
        },
        broadcast: 'dedicatedCloud.users.right.refresh',
      },
    );
  }

  getUserRight(serviceName, userId, rightId) {
    return this.OvhHttp.get(
      '/dedicatedCloud/{serviceName}/user/{userId}/right/{rightId}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          userId,
          rightId,
        },
      },
    );
  }

  getPasswordPolicy(serviceName) {
    return this.OvhHttp.get('/dedicatedCloud/{serviceName}/passwordPolicy', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  }

  /* ------- SECURITY -------*/

  getSecurityInformations(serviceName) {
    return this.OvhHttp.get('/dedicatedCloud/{serviceName}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    }).then((dedicatedCloud) => ({
      userLimitConcurrentSession: dedicatedCloud.userLimitConcurrentSession,
      userSessionTimeout: dedicatedCloud.userSessionTimeout / 60,
      userAccessPolicy: snakeCase(
        dedicatedCloud.userAccessPolicy,
      ).toUpperCase(),
      logoutPolicy: snakeCase(dedicatedCloud.userLogoutPolicy).toUpperCase(),
    }));
  }

  getSecurityPolicies(serviceName, pageSize, offset, isCacheDisabled) {
    return this.icebergUtils.icebergQuery(
      `/dedicatedCloud/${serviceName}/allowedNetwork`,
      {
        pageSize,
        offset,
        isCacheDisabled,
        sort: 'networkAccessId',
      },
    );
  }

  addSecurityPolicy(serviceName, network) {
    if (!/\/[0-9]{3}$/.test(network.value)) {
      // eslint-disable-next-line no-param-reassign
      network.value += '/32';
    }
    return this.OvhHttp.post('/dedicatedCloud/{serviceName}/allowedNetwork', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data: {
        description: network.description,
        network: network.value,
      },
    });
  }

  deleteSecurityPolicy(serviceName, entry) {
    return this.OvhHttp.delete(
      '/sws/dedicatedCloud/{serviceName}/networks-delete',
      {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        data: {
          networkAccessIds: entry,
        },
      },
    );
  }

  deleteSecurityPolicies(serviceName, networkAccessIds) {
    return this.OvhHttp.delete(
      '/sws/dedicatedCloud/{serviceName}/networks-delete',
      {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        data: {
          networkAccessIds,
        },
      },
    );
  }

  modifySecurityPolicy(serviceName, entry) {
    return this.OvhHttp.put(
      '/dedicatedCloud/{serviceName}/allowedNetwork/{networkAccessId}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          networkAccessId: entry.networkAccessId,
        },
        data: {
          description: entry.description,
          network: entry.network,
        },
      },
    );
  }

  updateSessionExpiration(serviceName, expiration) {
    return this.OvhHttp.put('/dedicatedCloud/{serviceName}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data: {
        userSessionTimeout: expiration * 60,
      },
    });
  }

  updateMaxConcurrentConnections(serviceName, userLimitConcurrentSession) {
    return this.OvhHttp.put('/dedicatedCloud/{serviceName}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data: {
        userLimitConcurrentSession,
      },
    });
  }

  modifyPolicyAccess(serviceName, accessPolicy) {
    return this.OvhHttp.put('/dedicatedCloud/{serviceName}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data: {
        userAccessPolicy: camelCase(accessPolicy),
      },
    });
  }

  modifyPolicyLogout(serviceName, logoutPolicy) {
    return this.OvhHttp.put('/dedicatedCloud/{serviceName}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data: {
        userLogoutPolicy: camelCase(logoutPolicy),
      },
    });
  }

  updateUser(serviceName, user) {
    return this.OvhHttp.post(
      '/dedicatedCloud/{serviceName}/user/{userId}/changeProperties',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          userId: user.userId,
        },
        data: {
          canManageIpFailOvers: user.canManageIpFailOvers,
          canManageNetwork: user.canManageNetwork,
          fullAdminRo: user.fullAdminRo,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          tokenValidator: user.tokenValidator,
          nsxRight: user.nsxRight,
          encryptionRight: user.encryptionRight,
        },
      },
    ).then((task) => {
      return this.pollUserTasks(serviceName, {
        namespace: 'dedicatedCloud.user.update.poll',
        task,
        user,
        successSates: [TASK_STATUS.CANCELED, TASK_STATUS.DONE],
        errorsSates: [TASK_STATUS.ERROR],
      });
    });
  }

  static checkPassword(policy, user) {
    if (!user.password) {
      return true;
    }

    if (
      user.password.length < policy.minLength ||
      user.password.length > policy.maxLength
    ) {
      return false;
    }

    if (policy.digitMandatory && !/[0-9]+/.test(user.password)) {
      return false;
    }

    if (policy.letterMandatory && !/[A-Za-z]+/.test(user.password)) {
      return false;
    }

    if (policy.lowercaseLetterMandatory && !/[a-z]+/.test(user.password)) {
      return false;
    }

    if (policy.uppercaseLetterMandatory && !/[A-Z]+/.test(user.password)) {
      return false;
    }

    if (
      policy.deniedChars.length &&
      some(policy.deniedChars, (ch) => ~indexOf(user.password, ch))
    ) {
      return false;
    }

    if (policy.specialMandatory && !/\W_/.test(user.password)) {
      return false;
    }

    return true;
  }

  hasSecurityOption(serviceName) {
    const promises = DEDICATED_CLOUD_CONSTANTS.securityOptions.map(
      (optionName) => this.getOptionState(optionName, serviceName),
    );
    return this.$q
      .all(promises)
      .then((results) =>
        results.some((optionInfo) => optionInfo !== 'disabled'),
      );
  }

  securityOptionsCompatibility(serviceName) {
    return this.$http
      .get(`/dedicatedCloud/${serviceName}/securityOptions/compatibilityMatrix`)
      .then(({ data }) => data);
  }

  /* --- Virtual Machine Encryption KMS --- */
  getVMEncryptionKMSList(serviceName) {
    return this.OvhApiDedicatedCloud.VMEncryption()
      .kms()
      .v6()
      .query({
        serviceName,
      })
      .$promise.then((kmsIds) => kmsIds);
  }

  getVMEncryptionKMSDetail(serviceName, kmsId) {
    return this.OvhApiDedicatedCloud.VMEncryption()
      .kms()
      .v6()
      .get({
        serviceName,
        kmsId,
      })
      .$promise.then((kms) => kms);
  }

  createVMEncryptionKMS(serviceName, { ip, description, sslThumbprint }) {
    return this.OvhApiDedicatedCloud.VMEncryption()
      .kms()
      .v6()
      .create(
        {
          serviceName,
        },
        {
          ip,
          description,
          sslThumbprint,
        },
      ).$promise;
  }

  deleteVMEncryptionKMS(serviceName, kmsId) {
    return this.OvhApiDedicatedCloud.VMEncryption()
      .kms()
      .v6()
      .delete(
        {
          serviceName,
        },
        {
          kmsId,
        },
      ).$promise;
  }

  editVMEncryptionKMS(serviceName, { kmsId, description, sslThumbprint }) {
    return this.OvhApiDedicatedCloud.VMEncryption()
      .kms()
      .v6()
      .changeProperties(
        {
          serviceName,
          kmsId,
        },
        {
          description,
          sslThumbprint,
        },
      ).$promise;
  }

  startVMEncryptionKMSPoller(serviceName, taskId) {
    const url = `/dedicatedCloud/${serviceName}/task/${taskId}`;
    const interval = VM_ENCRYPTION_KMS.pollingDelay;
    return this.Poller.poll(url, null, {
      method: 'get',
      namespace: taskId,
      interval,
      successRule: (taskResult) => taskResult.state !== 'error',
      errorRule: (taskResult) => taskResult.state === 'error',
    });
  }

  stopVMEncryptionPoller(taskId) {
    return this.Poller.kill({ namespace: taskId });
  }

  /* ------- Resource -------*/

  getUpgradeResourceDurations(
    serviceName,
    upgradeType,
    upgradedResourceType,
    upgradedResourceId,
  ) {
    const params = {
      upgradeType,
    };

    if (upgradedResourceType) {
      params.upgradedRessourceType = upgradedResourceType;
      params.upgradedRessourceId = upgradedResourceId;
    } else {
      params.upgradedRessourceType = 'all';
    }

    return this.OvhHttp.get(
      '/order/dedicatedCloud/{serviceName}/upgradeRessource',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        params,
      },
    );
  }

  getUpgradeResourceOrder(
    serviceName,
    upgradeType,
    duration,
    upgradedResourceType,
    upgradedResourceId,
  ) {
    const params = {
      upgradeType,
    };

    if (upgradedResourceType) {
      params.upgradedRessourceType = upgradedResourceType;
      params.upgradedRessourceId = upgradedResourceId;
    } else {
      params.upgradedRessourceType = 'all';
    }

    return this.OvhHttp.get(
      '/order/dedicatedCloud/{serviceName}/upgradeRessource/{duration}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          duration,
        },
        params,
      },
    );
  }

  upgradedResource(
    serviceName,
    upgradeType,
    duration,
    upgradedResourceType,
    upgradedResourceId,
  ) {
    const params = {
      upgradeType,
    };
    if (upgradedResourceType) {
      params.upgradedRessourceType = upgradedResourceType;
      params.upgradedRessourceId = upgradedResourceId;
    } else {
      params.upgradedRessourceType = 'all';
    }

    return this.OvhHttp.post(
      '/order/dedicatedCloud/{serviceName}/upgradeRessource/{duration}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          duration,
        },
        data: params,
      },
    );
  }

  /* ------- Upgrade -------*/
  upgrade(serviceName) {
    return this.OvhHttp.post(
      '/dedicatedCloud/{serviceName}/upgradeHypervisor',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      },
    );
  }

  updateSoftware(serviceName, release) {
    return this.OvhHttp.post('/dedicatedCloud/{serviceName}/upgradeVcenter', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data: {
        release,
      },
    });
  }

  isOptionToggable(serviceName, optionName, state, _returnAsBoolean) {
    let returnAsBoolean = _returnAsBoolean;

    if (isUndefined(returnAsBoolean)) {
      returnAsBoolean = true;
    }

    if (!includes(this.availableOptions, optionName)) {
      throw new Error('Valid optionName are nsx, vrops, hds, hipaa and pcidss');
    }

    if (includes(['disabling', 'enabling'], state)) {
      // while enabling/disabling activation button not show, no need for a message (the tooltip)
      return { toggable: false };
    }

    const endpoint = `canBe${state === 'enabled' ? 'Disabled' : 'Enabled'}`;

    return this.OvhHttp.get(
      '/dedicatedCloud/{serviceName}/{optionName}/{endpoint}',
      {
        urlParams: {
          serviceName,
          optionName,
          endpoint,
        },
        rootPath: 'apiv6',
        returnErrorKey: '',
      },
    )
      .then((response) => {
        // API return a funny response, assume it is true if the response was a 200
        if (returnAsBoolean === true) {
          return { toggable: true };
        }
        return response;
      })
      .catch((err) => ({ toggable: false, error: err }));
  }

  getOptionState(optionName, serviceName) {
    return this.OvhHttp.get('/dedicatedCloud/{serviceName}/{optionName}', {
      urlParams: {
        serviceName,
        optionName,
      },
      rootPath: 'apiv6',
    }).then((response) => response.state);
  }

  enableOption(serviceName, optionName) {
    return this.OvhHttp.post(
      '/dedicatedCloud/{serviceName}/{optionName}/enable',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          optionName,
        },
      },
    );
  }

  disableOption(serviceName, optionName) {
    return this.OvhHttp.post(
      '/dedicatedCloud/{serviceName}/{optionName}/disable',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          optionName,
        },
      },
    );
  }

  fetchAllHostsPrices(
    serviceName,
    currentCommercialRangeName,
    newCommercialRange,
    location,
  ) {
    return this.fetchHosts(serviceName).then((hosts) => {
      const currentHosts = angular.copy(hosts);
      const nextHosts = angular.copy(hosts);
      return this.$q.all({
        current: this.$q.all(
          currentHosts.map((host) =>
            this.fillHostPrice(
              currentCommercialRangeName,
              host.commercialSubRange,
              location,
              host,
            ),
          ),
        ),
        next: this.$q.all(
          nextHosts.map((host) =>
            this.fillHostPrice(
              newCommercialRange,
              host.commercialSubRange,
              location,
              host,
            ),
          ),
        ),
      });
    });
  }

  fetchHosts(serviceName) {
    return this.getDatacenters(serviceName).then((dataCenters) => {
      if (dataCenters?.length > 0) {
        return this.$q
          .all(
            dataCenters.map((dataCenter) =>
              this.getHosts(serviceName, dataCenter.id)
                .then((hostIds) =>
                  this.$q.all(
                    hostIds.map((hostId) =>
                      this.getHost(serviceName, dataCenter.id, hostId),
                    ),
                  ),
                )
                .then((hosts) =>
                  hosts.map((host) =>
                    assign(host, {
                      datacenter: dataCenter.name,
                      commercialSubRange: dataCenter.commercialRangeName
                        .substr(6)
                        .toLowerCase(),
                    }),
                  ),
                ),
            ),
          )
          .then((dataCentersHosts) => flatten(dataCentersHosts));
      }
      return [];
    });
  }

  fillHostPrice(commercialRange, commercialSubRange, location, host) {
    return this.getHostPrice(
      commercialRange,
      commercialSubRange,
      location,
      host.billingType,
      host.profile,
    ).then((price) => assign(host, { price: price.text }));
  }

  /**
   * Poll request
   */
  pollRequestState(opts) {
    const taskId = opts.task.taskId || opts.task;

    if (!taskId) {
      return this.$rootScope.$broadcast('dedicatedCloud.error', '');
    }

    this.$rootScope.$broadcast(
      ['dedicatedCloud', opts.namespace, 'start'].join('.'),
      opts,
    );

    return this.Poll.poll(
      ['apiv6/dedicatedCloud', opts.serviceName, 'task', taskId].join('/'),
      null,
      {
        successRule: { state: TASK_STATUS.DONE },
        namespace: 'dedicatedCloud.request',
      },
    ).then(
      (task) => {
        this.$rootScope.$broadcast(
          ['dedicatedCloud', opts.namespace, TASK_STATUS.DONE].join('.'),
          task,
        );
      },
      (err) => {
        this.$rootScope.$broadcast(
          ['dedicatedCloud', opts.namespace, TASK_STATUS.ERROR].join('.'),
          err,
        );
      },
    );
  }

  killAllPolling() {
    angular.forEach(['enableUser', 'disableUser'], (action) => {
      this.Poll.kill({ namespace: `dedicatedCloud.${action}` });
    });
  }

  /* ------- Terminate -------*/

  /**
   *  DEPRECATED : use OvhApiDedicatedCloudV6.terminate from ovh-api-services instead.
   */
  terminate(serviceName) {
    return this.OvhHttp.post('/dedicatedCloud/{serviceName}/terminate', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  }

  /**
   *  DEPRECATED : use OvhApiDedicatedCloudV6.confirmTermination from ovh-api-services instead.
   */
  confirmTerminate(serviceName, reason, token, commentary) {
    return this.OvhHttp.post(
      '/dedicatedCloud/{serviceName}/confirmTermination',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {
          reason,
          token,
          commentary,
        },
      },
    );
  }

  /* ------- Management Fees -------*/
  getManagementFeePlan(serviceId, planCode) {
    return this.$http
      .get(`/services/${serviceId}/upgrade/${planCode}`)
      .then(({ data }) => data);
  }

  getOrderDetails(serviceId, plan, quantity) {
    return this.$http
      .post(`/services/${serviceId}/upgrade/${plan.planCode}/simulate`, {
        quantity,
        duration: plan.duration,
        pricingMode: plan.pricingMode,
        autoPayWithPreferredPaymentMethod: true,
      })
      .then(({ data }) => data);
  }

  orderManagementFee(serviceId, plan, quantity) {
    return this.$http
      .post(`/services/${serviceId}/upgrade/${plan.planCode}/execute`, {
        quantity,
        duration: plan.duration,
        pricingMode: plan.pricingMode,
        autoPayWithPreferredPaymentMethod: true,
      })
      .then(({ data }) => data);
  }

  /* ------- Operations -------*/

  getOperations(serviceName, paginationParams, urlParams) {
    return this.icebergUtils.icebergQuery(
      `/dedicatedCloud/${serviceName}/task`,
      paginationParams,
      urlParams,
    );
  }

  getOperation(serviceName, opts) {
    return this.OvhHttp.get('/dedicatedCloud/{serviceName}/task/{taskId}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
        taskId: opts.taskId,
      },
    });
  }

  getOperationDescription(serviceName, opts) {
    return this.OvhHttp.get('/dedicatedCloud/{serviceName}/robot/{name}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
        name: opts.name,
      },
      cache: 'UNIVERS_DEDICATED_DEDICATED_CLOUD_OPERATIONS',
      clearCache: opts.forceRefresh,
      returnErrorKey: '',
    }).catch((err) => {
      if (err.status === 404) {
        return {
          description: '',
        };
      }
      return this.$q.reject(err);
    });
  }

  updateOperation(serviceName, opts) {
    return this.OvhHttp.post(
      '/dedicatedCloud/{serviceName}/task/{taskId}/changeMaintenanceExecutionDate',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          taskId: opts.taskId,
        },
        data: opts.data,
      },
    );
  }

  getUserOperations(serviceName, opts) {
    return this.OvhHttp.get(
      '/dedicatedCloud/{serviceName}/user/{userId}/task',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          userId: opts.userId,
        },
        params: opts.params,
      },
    );
  }

  getUserOperationsDetail(serviceName, opts) {
    return this.getUserOperations(serviceName, opts).then((tasks) => {
      const taskPromises = tasks.map((task) =>
        this.OvhHttp.get(
          '/dedicatedCloud/{serviceName}/user/{userId}/task/{taskId}',
          {
            rootPath: 'apiv6',
            urlParams: {
              serviceName,
              userId: opts.userId,
              taskId: task,
            },
          },
        ),
      );

      return this.$q.all(taskPromises);
    });
  }

  getFirstUserOperationDetail(serviceName, opts) {
    return this.getUserOperations(serviceName, opts).then((tasks) => {
      if (!tasks.length) {
        return null;
      }

      return this.OvhHttp.get(
        [
          '/dedicatedCloud',
          serviceName,
          'user',
          opts.userId,
          'task',
          tasks[0],
        ].join('/'),
        {
          rootPath: 'apiv6',
        },
      );
    });
  }

  getModels() {
    return this.OvhHttp.get('/dedicatedCloud.json', {
      rootPath: 'apiv6',
      cache: 'UNIVERS_DEDICATED_DEDICATED_CLOUD_OPERATION_MODELS',
    });
  }

  getDedicatedCloudTasksPromise(dedicatedCloud, taskState) {
    return this.OvhHttp.get('/dedicatedCloud/{serviceName}/task', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName: dedicatedCloud.name,
      },
      params: {
        state: taskState,
      },
    });
  }

  getDedicatedCloudTaskPromise(dedicatedCloud, taskId) {
    return this.OvhHttp.get('/dedicatedCloud/{serviceName}/task/{taskId}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName: dedicatedCloud.name,
        taskId,
      },
    });
  }

  convertToGlobal(serviceName, filerId) {
    return this.OvhHttp.post(
      `/dedicatedCloud/${serviceName}/filer/${filerId}/convertToGlobal`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  pollUserTasks(serviceName, opts) {
    if (!opts.user || !opts.task) {
      return this.$rootScope.$broadcast(`${opts.namespace}.error`, '');
    }

    if (!Array.isArray(opts.successSates)) {
      set(opts, 'successSates', [opts.successSates]);
    }

    const url = [
      'apiv6/dedicatedCloud',
      serviceName,
      'user',
      opts.user.userId,
      'task',
      opts.task.taskId,
    ].join('/');

    this.$rootScope.$broadcast(`${opts.namespace}.start`, opts.task, opts.user);
    return this.Poller.poll(url, null, {
      namespace: opts.namespace,
      interval: 5000,
      successRule: {
        state(task) {
          return opts.successSates.indexOf(task.state) !== -1;
        },
      },
      errorRule: {
        state(task) {
          return opts.errorsSates.indexOf(task.state) !== -1;
        },
      },
    }).then(
      (pollObject, task) => {
        this.$rootScope.$broadcast(
          `${opts.namespace}.done`,
          pollObject,
          task,
          opts.user,
        );
      },
      (err) => {
        this.$rootScope.$broadcast(`${opts.namespace}.error`, err, opts.user);
      },
      (task) => {
        this.$rootScope.$broadcast(`${opts.namespace}.doing`, task, opts.user);
      },
    );
  }

  stopAllPolling(opts) {
    this.Poller.kill({ namespace: opts.namespace });
  }

  getVCDGuideLinks() {
    const { ovhSubsidiary } = this.coreConfig.getUser();
    return VCD_GUIDE_LINKS[ovhSubsidiary] || VCD_GUIDE_LINKS.DEFAULT;
  }

  getVCDPricingMode(serviceName) {
    return this.$http
      .get(`/dedicatedCloud/${serviceName}/servicePack`)
      .then(
        ({ data: { name } }) =>
          VCD_SERVICE_PACK_PRICING_MODE[name] ?? `pcc-servicepack-${name}`,
      );
  }

  getPCCMigrationState(serviceName) {
    const resourcePath = `${serviceName}/option/tovcdmigration`;
    return this.$q
      .all({
        step1: this.$http.get('/services', {
          params: { resourceName: resourcePath },
        }),
        step2: this.$http.get('/services', {
          params: {
            resourceName: `${resourcePath}/migration`,
          },
        }),
      })
      .then(({ step1, step2 }) => {
        const countStep1 = step1?.data?.length;
        const countStep2 = step2?.data?.length;
        return new PCCMigrationState((countStep1 ?? 0) + (countStep2 ?? 0));
      })
      .catch(() => new PCCMigrationState(0));
  }

  getVCDMigrationState(serviceName) {
    return this.$http
      .get(`/dedicatedCloud/${serviceName}/tag/vcdMigration`)
      .then(({ data }) => new VCDMigrationState(data))
      .catch(() => null);
  }

  getLocation(serviceName) {
    return this.$http
      .get(`/dedicatedCloud/${serviceName}/location`)
      .then(({ data }) => data);
  }

  getCatalog() {
    const { isTrusted, ovhSubsidiary } = this.coreConfig.getUser();
    const feature = 'dedicated-cloud:enterprise-catalog';
    return this.ovhFeatureFlipping
      .checkFeatureAvailability(feature)
      .then((featureAvailability) =>
        featureAvailability.isFeatureAvailable(feature),
      )
      .catch(() => false)
      .then((isEnterpriseCatalog) => {
        const isSNC = !isEnterpriseCatalog && isTrusted;
        const params = {
          ovhSubsidiary,
          catalogName: isSNC ? 'private_cloud_snc' : undefined,
        };
        const url = `/order/catalog/${
          isSNC ? 'private' : 'formatted'
        }/privateCloud${isEnterpriseCatalog ? 'Enterprise' : ''}`;
        return this.$http
          .get(url, { params, cache: true })
          .then(({ data }) => data);
      });
  }

  getDatacenterOptions(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/options`)
      .then(({ data }) => data);
  }
}

angular
  .module(moduleName, [IcebergUtilsService])
  .service('DedicatedCloud', DedicatedCloudService);

export default moduleName;
