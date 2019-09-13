angular.module('managerApp')
  .controller('CdaUserDetailsPermissionListEditCtrl', function ($q, $stateParams, $translate, $state, CucCloudMessage, OvhApiDedicatedCeph, CdaUserPermissionService) {
    const self = this;

    self.loading = false;
    self.saving = false;

    self.serviceName = $stateParams.serviceName;
    self.userName = $stateParams.userName;

    self.states = {
      permissionList: 'paas.cda.cda-details.cda-user.cda-user-details.cda-user-details-permission-list',
    };

    self.datas = {
      userPermissions: [],
      pools: [],
      poolsDisplay: [],
    };

    self.accessTypes = [];

    function initUserPermissions() {
      OvhApiDedicatedCeph.User().Pool().v6().resetQueryCache();

      return OvhApiDedicatedCeph.User().Pool().v6().query({
        serviceName: $stateParams.serviceName,
        userName: $stateParams.userName,
      }).$promise.then((userPermissions) => {
        self.datas.userPermissions = userPermissions;
        return userPermissions;
      });
    }

    function initPools() {
      OvhApiDedicatedCeph.Pool().v6().resetQueryCache();

      return OvhApiDedicatedCeph.Pool().v6().query({
        serviceName: $stateParams.serviceName,
      }).$promise.then((pools) => {
        self.datas.pools = pools;
        return pools;
      });
    }

    function computePoolsDisplay(userPermissions, pools) {
      return CdaUserPermissionService.computePoolsDisplay(userPermissions, pools);
    }

    function displayError(error) {
      CucCloudMessage.error([$translate.instant('ceph_common_error'), (error.data && error.data.message) || ''].join(' '));
    }

    function init() {
      self.loading = true;
      self.accessTypes = CdaUserPermissionService.accessTypes;

      $q
        .allSettled([initUserPermissions(), initPools()])
        .then(poolsData => computePoolsDisplay(poolsData[0], poolsData[1]))
        .then((poolsDisplay) => {
          self.datas.poolsDisplay = poolsDisplay;
        })
        .catch((errors) => {
          displayError(_.find(errors, error => error));
        })
        .finally(() => {
          self.loading = false;
        });
    }

    function hasActivePermissionForPool(permissions) {
      return _.findIndex(permissions, value => value === true) !== -1;
    }

    self.saveUserPermissions = function () {
      self.saving = true;
      const typeKeys = _.keys(self.accessTypes);
      const permissionsToSave = _.filter(self.datas.poolsDisplay, (pool) => {
        const permissions = _.values(_.pick(pool, typeKeys));
        return hasActivePermissionForPool(permissions);
      });

      return OvhApiDedicatedCeph.User().Pool().v6().post({
        serviceName: $stateParams.serviceName,
        userName: $stateParams.userName,
      }, {
        permissions: permissionsToSave,
      }).$promise.then(() => {
        CucCloudMessage.success($translate.instant('cda_user_details_permissions_list_edit_success'));
        $state.go(self.states.permissionList);
      }).catch((error) => {
        displayError(error);
      }).finally(() => {
        self.saving = false;
      });
    };

    init();
  });
