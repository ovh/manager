import find from 'lodash/find';

export default class CdaUserDetailsPermissionListCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $translate,
    CucCloudMessage,
    OvhApiDedicatedCeph,
    CdaUserPermissionService,
  ) {
    const self = this;
    self.loading = false;

    self.datas = {
      userPermissions: [],
      pools: [],
      poolsDisplay: [],
    };

    function initUserPermissions() {
      OvhApiDedicatedCeph.User()
        .Pool()
        .v6()
        .resetQueryCache();

      return OvhApiDedicatedCeph.User()
        .Pool()
        .v6()
        .query({
          serviceName: $stateParams.serviceName,
          userName: $stateParams.userName,
        })
        .$promise.then((userPermissions) => {
          self.datas.userPermissions = userPermissions;
          return userPermissions;
        });
    }

    function initPools() {
      OvhApiDedicatedCeph.Pool()
        .v6()
        .resetQueryCache();

      return OvhApiDedicatedCeph.Pool()
        .v6()
        .query({
          serviceName: $stateParams.serviceName,
        })
        .$promise.then((pools) => {
          self.datas.pools = pools;
          return pools;
        });
    }

    function computePoolsDisplay(userPermissions, pools) {
      return CdaUserPermissionService.computePoolsDisplay(
        userPermissions,
        pools,
      );
    }

    function displayError(error) {
      CucCloudMessage.error(
        [
          $translate.instant('ceph_common_error'),
          (error.data && error.data.message) || '',
        ].join(' '),
      );
    }

    function init() {
      self.loading = true;

      $q.all([initUserPermissions(), initPools()])
        .then((poolsData) => computePoolsDisplay(poolsData[0], poolsData[1]))
        .then((poolsDisplay) => {
          self.datas.poolsDisplay = poolsDisplay;
        })
        .catch((errors) => {
          displayError(find(errors, (error) => error));
        })
        .finally(() => {
          self.loading = false;
        });
    }

    init();
  }
}
