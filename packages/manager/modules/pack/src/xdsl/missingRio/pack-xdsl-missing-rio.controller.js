angular.module('managerApp').controller('PackXdslMissingRioCtrl', function ($q, $stateParams, $translate, OvhApiXdsl, TucToast) {
  const self = this;

  this.loading = true;

  this.init = function () {
    self.loading = true;

    self.missingRioForm = {};
    self.missingRioForm.portNumber = true;

    self.number = $stateParams.number;

    return OvhApiXdsl.v6().get({
      xdslId: $stateParams.serviceName,
    }).$promise.then(data => data, (err) => {
      TucToast.error([$translate.instant('xdsl_missing-rio_init_error'), _.get(err, 'data.message')].join(' '));
      return $q.reject(err);
    }).then(() => {
      self.loading = false;
    });
  };

  /**
     * Send Rio number
     */
  this.sendRio = function () {
    self.loading = true;

    const params = { relaunchWithoutPortability: self.missingRioForm.portNumber };
    if (!self.missingRioForm.portNumber) {
      params.rio = self.missingRioForm.rio;
    }

    return OvhApiXdsl.v6().updateInvalidOrMissingRio({
      xdslId: $stateParams.serviceName,
    }, params).$promise.then(() => {
      TucToast.success($translate.instant('xdsl_missing-rio_sent'));
      self.init();
    }, (err) => {
      TucToast.error([$translate.instant('xdsl_missing-rio_error'), _.get(err, 'data.message')].join(' '));
      return $q.reject(err);
    }).finally(() => {
      self.loading = false;
    });
  };

  this.init();
});
