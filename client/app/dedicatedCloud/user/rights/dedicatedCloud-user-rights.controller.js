angular.module('App').controller('DedicatedCloudUserRightsCtrl', function ($scope, $stateParams, $translate, DedicatedCloud) {
  const self = this;
  self.selectedUser = null;
  self.loading = {
    init: false,
  };

  self.loadUserRights = ({ offset, pageSize }) => DedicatedCloud.getUserRights(
    $stateParams.productId,
    $stateParams.userId,
    pageSize,
    offset - 1,
  ).then(results => ({
    data: _.get(results, 'list.results'),
    meta: {
      totalCount: results.count,
    },
  }));

  self.$onInit = function () {
    self.loading.init = true;

    return DedicatedCloud
      .getUserDetail($stateParams.productId, $stateParams.userId)
      .then((details) => {
        self.selectedUser = details;
      })
      .finally(() => {
        self.loading.init = false;
      });
  };
});
