import assign from 'lodash/assign';
import camelCase from 'lodash/camelCase';
import flatten from 'lodash/flatten';
import includes from 'lodash/includes';
import indexOf from 'lodash/indexOf';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import pick from 'lodash/pick';
import set from 'lodash/set';
import snakeCase from 'lodash/snakeCase';
import some from 'lodash/some';
import toNumber from 'lodash/toNumber';

angular
  .module('services')
  .constant('VEEAM_STATE_ENUM', {
    ENABLED: 'enabled',
    DISABLED: 'disabled',
    DISABLING: 'DISABLING',
    ENABLING: 'ENABLING',
    ERROR: 'ERROR',
    REMOVING: 'REMOVING',
  })
  .constant('COMMERCIAL_RANGE_ENUM', {
    '2014v1Infrastructure': '2014 Infrastructure',
    '2014v1Enterprise': '2014 Enterprise',
    '2013v1': '2013',
  })
  .service('DedicatedCloud', function DedicatedCloudService(
    $q,
    $cacheFactory,
    $rootScope,
    OvhApiDedicatedCloud,
    OvhHttp,
    Poll,
    Poller,
    DEDICATED_CLOUD_CONSTANTS,
    UNAVAILABLE_PCC_CODE,
    VM_ENCRYPTION_KMS,
  ) {
    const self = this;
    const dedicatedCloudCache = {
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
    const availableOptions = flatten([
      'nsx',
      'vrops',
      DEDICATED_CLOUD_CONSTANTS.securityOptions,
    ]);

    /* ------- INFORMATIONS -------*/
    this.getAllPccs = () =>
      OvhApiDedicatedCloud.v6()
        .query()
        .$promise.then((pccIds) =>
          $q.all(
            pccIds.map((pccId) =>
              OvhApiDedicatedCloud.v6()
                .get({
                  serviceName: pccId,
                })
                .$promise.catch((error) =>
                  error.status === UNAVAILABLE_PCC_CODE
                    ? undefined
                    : $q.reject(error),
                ),
            ),
          ),
        );

    this.getSelected = (serviceName, forceRefresh) =>
      OvhHttp.get('/sws/dedicatedCloud/{serviceName}', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        cache: dedicatedCloudCache.all,
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

    this.getDescription = (serviceName) =>
      OvhHttp.get('/dedicatedCloud/{serviceName}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      });

    this.updateDescription = (serviceName, description) =>
      OvhHttp.put('/dedicatedCloud/{serviceName}', {
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
        clearAllCache: dedicatedCloudCache.all,
      });

    /* ------- DATACENTER -------*/

    this.getDatacenters = (serviceName) =>
      OvhHttp.get('/sws/dedicatedCloud/{serviceName}/datacenters-summary', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
      });

    this.getDatacentersInformations = (
      serviceName,
      elementsByPage,
      elementsToSkip,
    ) =>
      OvhHttp.get('/sws/dedicatedCloud/{serviceName}/datacenters', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        params: {
          count: elementsByPage,
          offset: elementsToSkip,
        },
      });

    this.getOrderableHostsProfiles = (serviceName, location, datacenterId) =>
      OvhHttp.get(
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

    this.getOrderableDatastoresProfiles = (
      serviceName,
      location,
      datacenterId,
    ) =>
      OvhHttp.get(
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

    this.getMonthlyHostOrder = (serviceName, datacenterId, name, quantity) =>
      OvhHttp.get('/order/dedicatedCloud/{serviceName}/host/{duration}', {
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
      });

    this.getMonthlyDatastoreOrder = (
      serviceName,
      datacenterId,
      name,
      quantity,
    ) =>
      OvhHttp.get('/order/dedicatedCloud/{serviceName}/filer/{duration}', {
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
      });

    this.orderHosts = (serviceName, datacenterId, name, quantity) =>
      OvhHttp.post('/order/dedicatedCloud/{serviceName}/host/{duration}', {
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
      });

    this.orderDatastores = (serviceName, datacenterId, name, quantity) =>
      OvhHttp.post('/order/dedicatedCloud/{serviceName}/filer/{duration}', {
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
      });

    this.getCommercialRangeList = (serviceName) =>
      OvhHttp.get('/dedicatedCloud/{serviceName}/commercialRange/orderable', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      });

    this.addDatacenter = (serviceName, commercialRangeName) =>
      OvhHttp.post('/dedicatedCloud/{serviceName}/datacenter', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {
          commercialRangeName,
        },
      });

    this.deleteDatacenter = (serviceName, datacenterId) =>
      OvhHttp.delete(
        '/dedicatedCloud/{serviceName}/datacenter/{datacenterId}',
        {
          rootPath: 'apiv6',
          urlParams: {
            serviceName,
            datacenterId,
          },
        },
      );

    /* ------- SUB DATACENTER -------*/

    this.getDatacenterInfoProxy = (serviceName, datacenterId) =>
      OvhHttp.get('/dedicatedCloud/{serviceName}/datacenter/{datacenterId}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          datacenterId,
        },
      });

    this.getDatacenterInformations = (
      serviceName,
      datacenterId,
      forceRefresh,
    ) =>
      OvhHttp.get(
        '/sws/dedicatedCloud/{serviceName}/datacenters/{datacenterId}',
        {
          rootPath: '2api',
          urlParams: {
            serviceName,
            datacenterId,
          },
          cache: 'SUB_DATACENTERS',
          clearCache: forceRefresh,
        },
      );

    this.updateDatacenterName = (serviceName, datacenterId, name) =>
      OvhHttp.put('/dedicatedCloud/{serviceName}/datacenter/{datacenterId}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          datacenterId,
        },
        data: {
          name,
        },
      });

    this.updateDatacenterDescription = (
      serviceName,
      datacenterId,
      description,
    ) =>
      OvhHttp.put('/dedicatedCloud/{serviceName}/datacenter/{datacenterId}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          datacenterId,
        },
        data: {
          description,
        },
        broadcast: 'global_display_name_change',
        broadcastParam: {
          stateParams: {
            productId: serviceName,
            datacenterId: toNumber(datacenterId),
          },
          displayName: description,
        },
      });

    /* ------- SUB DATACENTER HOSTS -------*/

    this.getPaginatedHosts = (
      serviceName,
      datacenterId,
      elementsByPage,
      elementsToSkip,
    ) =>
      OvhHttp.get(
        '/sws/dedicatedCloud/{serviceName}/datacenters/{datacenterId}/hosts',
        {
          rootPath: '2api',
          urlParams: {
            serviceName,
            datacenterId,
          },
          params: {
            count: elementsByPage,
            offset: elementsToSkip,
          },
        },
      );

    this.getHosts = (serviceName, datacenterId) =>
      OvhHttp.get(
        '/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/host',
        {
          rootPath: 'apiv6',
          urlParams: {
            serviceName,
            datacenterId,
          },
        },
      );

    this.getHost = (serviceName, datacenterId, hostId) =>
      OvhHttp.get(
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

    this.getHostPrice = (
      commercialRange,
      commercialSubRange,
      location,
      billingType,
      hostProfile,
    ) => {
      if (self.hostHasNoPrice(billingType)) {
        return $q.when({});
      }
      return OvhHttp.get(
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
    };

    this.hostHasNoPrice = (billingType) => billingType === 'freeSpare';

    /* ------- SUB DATACENTER DATASTORES -------*/

    this.getDatastores = (
      serviceName,
      datacenterId,
      elementsByPage,
      elementsToSkip,
    ) =>
      OvhHttp.get(
        '/sws/dedicatedCloud/{serviceName}/datacenters/{datacenterId}/datastores',
        {
          rootPath: '2api',
          urlParams: {
            serviceName,
            datacenterId,
          },
          params: {
            count: elementsByPage,
            offset: elementsToSkip,
          },
        },
      );

    /* ------- SUB DATACENTER LICENCES -------*/

    this.getDatacenterLicence = (serviceName, serviceUsesLegacyOrder) => {
      if (!serviceUsesLegacyOrder) {
        return OvhHttp.get('/dedicatedCloud/{serviceName}', {
          rootPath: 'apiv6',
          urlParams: {
            serviceName,
          },
        }).then((pcc) => ({
          canOrderSpla: !pcc.spla,
          isSplaActive: pcc.spla,
        }));
      }
      return $q
        .all({
          pcc: OvhHttp.get('/dedicatedCloud/{serviceName}', {
            rootPath: 'apiv6',
            urlParams: {
              serviceName,
            },
          }),
          order: OvhHttp.get('/order/dedicatedCloud/{serviceName}', {
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
          $q.reject({
            canOrderSpla: false,
            isSplaActive: false,
            messages: Array.isArray(err) ? err : [err],
            state: 'ERROR',
          }),
        );
    };

    this.getSplaOrder = (serviceName) =>
      OvhHttp.get('/order/dedicatedCloud/{serviceName}/spla', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      });

    this.postSplaOrder = (serviceName) =>
      OvhHttp.post('/order/dedicatedCloud/{serviceName}/spla', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      });

    /* ------- USER -------*/

    this.getUsers = (serviceName, name) =>
      OvhHttp.get('/dedicatedCloud/{serviceName}/user', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        params: {
          name,
        },
      });

    this.getUserDetail = (serviceName, userId) =>
      OvhHttp.get('/dedicatedCloud/{serviceName}/user/{userId}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          userId,
        },
      });

    this.addUser = (serviceName, user) =>
      OvhHttp.post('/dedicatedCloud/{serviceName}/user', {
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
        broadcast: 'dedicatedCloud.users.refresh',
      });

    this.resetUserPassword = (serviceName, user, password) =>
      OvhHttp.post(
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
        self.pollUserTasks(serviceName, {
          namespace: 'dedicatedCloud.password.update.poll',
          task,
          user,
          successSates: ['canceled', 'done'],
          errorsSates: ['error'],
        });
      });

    this.deleteUser = (serviceName, userId) =>
      OvhHttp.delete('/dedicatedCloud/{serviceName}/user/{userId}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          userId,
        },
        broadcast: 'dedicatedCloud.users.refresh',
      });

    this.enableUser = (serviceName, userId) =>
      OvhHttp.post('/dedicatedCloud/{serviceName}/user/{userId}/enable', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          userId,
        },
        broadcast: 'dedicatedCloud.users.refresh',
      }).then((task) => {
        self.pollRequestState({ serviceName, task, namespace: 'enableUser' });
      });

    this.disableUser = (serviceName, userId) =>
      OvhHttp.post('/dedicatedCloud/{serviceName}/user/{userId}/disable', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          userId,
        },
        broadcast: 'dedicatedCloud.users.refresh',
      }).then((task) => {
        self.pollRequestState({ serviceName, task, namespace: 'disableUser' });
      });

    this.getUserRights = (
      serviceName,
      userId,
      elementsByPage,
      elementsToSkip,
    ) =>
      OvhHttp.get('/sws/dedicatedCloud/{serviceName}/users/{userId}/rights', {
        rootPath: '2api',
        urlParams: {
          serviceName,
          userId,
        },
        params: {
          count: elementsByPage,
          offset: elementsToSkip,
        },
      });

    this.setUserRights = (serviceName, userId, right) =>
      OvhHttp.put(
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

    this.getUserRight = (serviceName, userId, rightId) =>
      OvhHttp.get(
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

    this.getPasswordPolicy = (serviceName) =>
      OvhHttp.get('/dedicatedCloud/{serviceName}/passwordPolicy', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      });

    /* ------- SECURITY -------*/

    this.getSecurityInformations = (serviceName) =>
      OvhHttp.get('/dedicatedCloud/{serviceName}', {
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

    this.getSecurityPolicies = (serviceName, count, offset, clearCache) =>
      OvhHttp.get('/sws/dedicatedCloud/{serviceName}/networks', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        params: {
          count,
          offset,
        },
        clearCache,
      });

    this.addSecurityPolicy = (serviceName, network) => {
      if (!/\/[0-9]{3}$/.test(network.value)) {
        // eslint-disable-next-line no-param-reassign
        network.value += '/32';
      }
      return OvhHttp.post('/dedicatedCloud/{serviceName}/allowedNetwork', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {
          description: network.description,
          network: network.value,
        },
        broadcast: 'dedicatedCloud.tabs.policy.refresh',
      });
    };

    this.deleteSecurityPolicy = (serviceName, entry) =>
      OvhHttp.delete('/sws/dedicatedCloud/{serviceName}/networks-delete', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        data: {
          networkAccessIds: entry,
        },
        broadcast: 'dedicatedCloud.tabs.policy.refresh',
      });

    this.deleteSecurityPolicies = (serviceName, networkAccessIds) =>
      OvhHttp.delete('/sws/dedicatedCloud/{serviceName}/networks-delete', {
        rootPath: '2api',
        urlParams: {
          serviceName,
        },
        data: {
          networkAccessIds,
        },
        broadcast: 'dedicatedCloud.tabs.policy.refresh',
      });

    this.modifySecurityPolicy = (serviceName, entry) =>
      OvhHttp.put(
        '/dedicatedCloud/{serviceName}/allowedNetwork/{networkAccessId}',
        {
          rootPath: 'apiv6',
          urlParams: {
            serviceName,
            networkAccessId: entry.id,
          },
          data: pick(entry, 'description'),
          broadcast: 'dedicatedCloud.tabs.policy.refresh',
        },
      );

    this.updateSessionExpiration = (serviceName, expiration) =>
      OvhHttp.put('/dedicatedCloud/{serviceName}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {
          userSessionTimeout: expiration * 60,
        },
        broadcast: 'dedicatedCloud.tabs.policy.info.refresh',
      });

    this.updateMaxConcurrentConnections = (
      serviceName,
      userLimitConcurrentSession,
    ) =>
      OvhHttp.put('/dedicatedCloud/{serviceName}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {
          userLimitConcurrentSession,
        },
        broadcast: 'dedicatedCloud.tabs.policy.info.refresh',
      });

    this.modifyPolicyAccess = (serviceName, accessPolicy) =>
      OvhHttp.put('/dedicatedCloud/{serviceName}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {
          userAccessPolicy: camelCase(accessPolicy),
        },
        broadcast: 'dedicatedCloud.tabs.policy.info.refreshaccess',
      });

    this.modifyPolicyLogout = (serviceName, logoutPolicy) =>
      OvhHttp.put('/dedicatedCloud/{serviceName}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {
          userLogoutPolicy: camelCase(logoutPolicy),
        },
        broadcast: 'dedicatedCloud.tabs.policy.info.refreshaccess',
      });

    this.updateUser = (serviceName, user) =>
      OvhHttp.post(
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
          },
        },
      ).then((task) => {
        self.pollUserTasks(serviceName, {
          namespace: 'dedicatedCloud.user.update.poll',
          task,
          user,
          successSates: ['canceled', 'done'],
          errorsSates: ['error'],
        });
      });

    this.checkPassword = (policy, user) => {
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
    };

    this.hasSecurityOption = (serviceName) => {
      const promises = DEDICATED_CLOUD_CONSTANTS.securityOptions.map(
        (optionName) => self.getOptionState(optionName, serviceName),
      );
      return $q
        .all(promises)
        .then((results) =>
          results.some((optionInfo) => optionInfo !== 'disabled'),
        );
    };

    /* --- Virtual Machine Encryption KMS --- */
    this.getVMEncryptionKMSList = (serviceName) =>
      OvhApiDedicatedCloud.VMEncryption()
        .kms()
        .v6()
        .query({
          serviceName,
        })
        .$promise.then((kmsIds) => kmsIds);

    this.getVMEncryptionKMSDetail = (serviceName, kmsId) =>
      OvhApiDedicatedCloud.VMEncryption()
        .kms()
        .v6()
        .get({
          serviceName,
          kmsId,
        })
        .$promise.then((kms) => kms);

    this.createVMEncryptionKMS = (
      serviceName,
      { ip, description, sslThumbprint },
    ) =>
      OvhApiDedicatedCloud.VMEncryption()
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

    this.deleteVMEncryptionKMS = (serviceName, kmsId) =>
      OvhApiDedicatedCloud.VMEncryption()
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

    this.editVMEncryptionKMS = (
      serviceName,
      { kmsId, description, sslThumbprint },
    ) =>
      OvhApiDedicatedCloud.VMEncryption()
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

    this.startVMEncryptionKMSPoller = (serviceName, taskId) => {
      const url = `/dedicatedCloud/${serviceName}/task/${taskId}`;
      const interval = VM_ENCRYPTION_KMS.pollingDelay;
      return Poller.poll(url, null, {
        method: 'get',
        namespace: taskId,
        interval,
        successRule: (taskResult) => taskResult.state !== 'error',
        errorRule: (taskResult) => taskResult.state === 'error',
      });
    };

    this.stopVMEncryptionPoller = (taskId) =>
      Poller.kill({ namespace: taskId });

    /* ------- Resource -------*/

    this.getUpgradeResourceDurations = (
      serviceName,
      upgradeType,
      upgradedResourceType,
      upgradedResourceId,
    ) => {
      const params = {
        upgradeType,
      };

      if (upgradedResourceType) {
        params.upgradedRessourceType = upgradedResourceType;
        params.upgradedRessourceId = upgradedResourceId;
      } else {
        params.upgradedRessourceType = 'all';
      }

      return OvhHttp.get(
        '/order/dedicatedCloud/{serviceName}/upgradeRessource',
        {
          rootPath: 'apiv6',
          urlParams: {
            serviceName,
          },
          params,
        },
      );
    };

    this.getUpgradeResourceOrder = (
      serviceName,
      upgradeType,
      duration,
      upgradedResourceType,
      upgradedResourceId,
    ) => {
      const params = {
        upgradeType,
      };

      if (upgradedResourceType) {
        params.upgradedRessourceType = upgradedResourceType;
        params.upgradedRessourceId = upgradedResourceId;
      } else {
        params.upgradedRessourceType = 'all';
      }

      return OvhHttp.get(
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
    };

    this.upgradedResource = (
      serviceName,
      upgradeType,
      duration,
      upgradedResourceType,
      upgradedResourceId,
    ) => {
      const params = {
        upgradeType,
      };
      if (upgradedResourceType) {
        params.upgradedRessourceType = upgradedResourceType;
        params.upgradedRessourceId = upgradedResourceId;
      } else {
        params.upgradedRessourceType = 'all';
      }

      return OvhHttp.post(
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
    };

    /* ------- Upgrade -------*/
    this.upgrade = (serviceName) =>
      OvhHttp.post('/dedicatedCloud/{serviceName}/upgradeHypervisor', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      });

    this.updateSoftware = (serviceName, release) =>
      OvhHttp.post('/dedicatedCloud/{serviceName}/upgradeVcenter', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {
          release,
        },
      });

    this.isOptionToggable = (
      serviceName,
      optionName,
      state,
      _returnAsBoolean,
    ) => {
      let returnAsBoolean = _returnAsBoolean;

      if (isUndefined(returnAsBoolean)) {
        returnAsBoolean = true;
      }

      if (!includes(availableOptions, optionName)) {
        throw new Error(
          'Valid optionName are nsx, vrops, hds, hipaa and pcidss',
        );
      }

      if (includes(['disabling', 'enabling'], state)) {
        // while enabling/disabling activation button not show, no need for a message (the tooltip)
        return { toggable: false };
      }

      const endpoint = `canBe${state === 'enabled' ? 'Disabled' : 'Enabled'}`;

      return OvhHttp.get(
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
    };

    this.getOptionState = (optionName, serviceName) =>
      OvhHttp.get('/dedicatedCloud/{serviceName}/{optionName}', {
        urlParams: {
          serviceName,
          optionName,
        },
        rootPath: 'apiv6',
      }).then((response) => response.state);

    this.enableOption = (serviceName, optionName) =>
      OvhHttp.post('/dedicatedCloud/{serviceName}/{optionName}/enable', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          optionName,
        },
      });

    this.disableOption = (serviceName, optionName) =>
      OvhHttp.post('/dedicatedCloud/{serviceName}/{optionName}/disable', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          optionName,
        },
      });

    this.fetchAllHostsPrices = (
      serviceName,
      currentCommercialRangeName,
      newCommercialRange,
      location,
    ) =>
      self.fetchHosts(serviceName).then((hosts) => {
        const currentHosts = angular.copy(hosts);
        const nextHosts = angular.copy(hosts);
        return $q.all({
          current: $q.all(
            currentHosts.map((host) =>
              self.fillHostPrice(
                currentCommercialRangeName,
                host.commercialSubRange,
                location,
                host,
              ),
            ),
          ),
          next: $q.all(
            nextHosts.map((host) =>
              self.fillHostPrice(
                newCommercialRange,
                host.commercialSubRange,
                location,
                host,
              ),
            ),
          ),
        });
      });

    this.fetchHosts = (serviceName) =>
      self.getDatacenters(serviceName).then((dataCenters) => {
        if (dataCenters.results && dataCenters.results.length > 0) {
          return $q
            .all(
              dataCenters.results.map((dataCenter) =>
                self
                  .getHosts(serviceName, dataCenter.id)
                  .then((hostIds) =>
                    $q.all(
                      hostIds.map((hostId) =>
                        self.getHost(serviceName, dataCenter.id, hostId),
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

    this.fillHostPrice = (
      commercialRange,
      commercialSubRange,
      location,
      host,
    ) =>
      self
        .getHostPrice(
          commercialRange,
          commercialSubRange,
          location,
          host.billingType,
          host.profile,
        )
        .then((price) => assign(host, { price: price.text }));

    /**
     * Poll request
     */
    this.pollRequestState = (opts) => {
      const taskId = opts.task.taskId || opts.task;

      if (!taskId) {
        return $rootScope.$broadcast('dedicatedCloud.error', '');
      }

      $rootScope.$broadcast(
        ['dedicatedCloud', opts.namespace, 'start'].join('.'),
        opts,
      );

      return Poll.poll(
        ['apiv6/dedicatedCloud', opts.serviceName, 'task', taskId].join('/'),
        null,
        {
          successRule: { state: 'done' },
          namespace: 'dedicatedCloud.request',
        },
      ).then(
        (task) => {
          $rootScope.$broadcast(
            ['dedicatedCloud', opts.namespace, 'done'].join('.'),
            task,
          );
        },
        (err) => {
          $rootScope.$broadcast(
            ['dedicatedCloud', opts.namespace, 'error'].join('.'),
            err,
          );
        },
      );
    };

    this.killAllPolling = () => {
      angular.forEach(['enableUser', 'disableUser'], (action) => {
        Poll.kill({ namespace: `dedicatedCloud.${action}` });
      });
    };

    /* ------- Terminate -------*/

    /**
     *  DEPRECATED : use OvhApiDedicatedCloudV6.terminate from ovh-api-services instead.
     */
    this.terminate = (serviceName) =>
      OvhHttp.post('/dedicatedCloud/{serviceName}/terminate', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      });

    /**
     *  DEPRECATED : use OvhApiDedicatedCloudV6.confirmTermination from ovh-api-services instead.
     */
    this.confirmTerminate = (serviceName, reason, token, commentary) =>
      OvhHttp.post('/dedicatedCloud/{serviceName}/confirmTermination', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {
          reason,
          token,
          commentary,
        },
      });

    /* ------- Operations -------*/
    this.getOperations = (serviceName, opts) =>
      OvhHttp.get('/dedicatedCloud/{serviceName}/task', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        params: opts.params,
      });

    this.getOperation = (serviceName, opts) =>
      OvhHttp.get('/dedicatedCloud/{serviceName}/task/{taskId}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          taskId: opts.taskId,
        },
      });

    this.getOperationDescription = (serviceName, opts) =>
      OvhHttp.get('/dedicatedCloud/{serviceName}/robot/{name}', {
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
        return $q.reject(err);
      });

    this.updateOperation = (serviceName, opts) =>
      OvhHttp.post(
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

    this.getUserOperations = (serviceName, opts) =>
      OvhHttp.get('/dedicatedCloud/{serviceName}/user/{userId}/task', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          userId: opts.userId,
        },
        params: opts.params,
      });

    this.getUserOperationsDetail = (serviceName, opts) =>
      this.getUserOperations(serviceName, opts).then((tasks) => {
        const taskPromises = tasks.map((task) =>
          OvhHttp.get(
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

        return $q.all(taskPromises);
      });

    this.getFirstUserOperationDetail = (serviceName, opts) =>
      this.getUserOperations(serviceName, opts).then((tasks) => {
        if (!tasks.length) {
          return null;
        }

        return OvhHttp.get(
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

    this.getModels = () =>
      OvhHttp.get('/dedicatedCloud.json', {
        rootPath: 'apiv6',
        cache: 'UNIVERS_DEDICATED_DEDICATED_CLOUD_OPERATION_MODELS',
      });

    self.getDedicatedCloudTasksPromise = (dedicatedCloud, taskState) =>
      OvhHttp.get('/dedicatedCloud/{serviceName}/task', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName: dedicatedCloud.name,
        },
        params: {
          state: taskState,
        },
      });

    self.getDedicatedCloudTaskPromise = (dedicatedCloud, taskId) =>
      OvhHttp.get('/dedicatedCloud/{serviceName}/task/{taskId}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName: dedicatedCloud.name,
          taskId,
        },
      });

    self.pollUserTasks = (serviceName, opts) => {
      if (!opts.user || !opts.task) {
        return $rootScope.$broadcast(`${opts.namespace}.error`, '');
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

      $rootScope.$broadcast(`${opts.namespace}.start`, opts.task, opts.user);
      return Poller.poll(url, null, {
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
          $rootScope.$broadcast(
            `${opts.namespace}.done`,
            pollObject,
            task,
            opts.user,
          );
        },
        (err) => {
          $rootScope.$broadcast(`${opts.namespace}.error`, err, opts.user);
        },
        (task) => {
          $rootScope.$broadcast(`${opts.namespace}.doing`, task, opts.user);
        },
      );
    };

    self.stopAllPolling = (opts) => {
      Poller.kill({ namespace: opts.namespace });
    };
  });
