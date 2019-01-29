angular.module('managerApp').controller('PackHostedEmailAddCtrl', function ($q, $scope, $stateParams, OvhApiPackXdslHostedEmail, TucToast, $translate, $location, tucValidator) {
  const self = this;

  this.add = function () {
    this.pendingOrder = true;

    TucToast.info($translate.instant('in_validation'));

    const accountTmp = angular.copy(self.account);
    delete accountTmp.name;
    delete accountTmp.domain;
    delete accountTmp.passwordConfirmation;

    accountTmp.email = self.account.name + self.account.domain;

    return OvhApiPackXdslHostedEmail.v6().save(
      {
        packId: $stateParams.packName,
      },
      accountTmp,
    ).$promise.then((data) => {
      TucToast.success($translate.instant('success_validation'));
      $location.path(`/pack/${$stateParams.packName}`);
      return data;
    }).catch((error) => {
      TucToast.error([$translate.instant('an_error_ocurred'), _.get(error, 'data.message', '')].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.pendingOrder = false;
    });
  };

  this.init = function () {
    $scope.domains = [];

    OvhApiPackXdslHostedEmail.v6().getDomains({ packId: $stateParams.packName }, (domains) => {
      _.each(domains, (domain) => {
        $scope.domains.push(`@${domain}`);
      });
    });

    $scope.$watchGroup(['ctrl.account.name', 'ctrl.account.domain'], (newValue) => {
      if (newValue[0] && newValue[1]) {
        const validAddress = tucValidator.isEmail(newValue[0] + newValue[1]);

        if (!validAddress) {
          $scope.accountForm.accountName.$error.invalidAddress = true;
        } else {
          delete $scope.accountForm.accountName.$error.invalidAddress;
        }

        $scope.accountForm.accountName.$validate();
      }
    });

    self.availablesDomains = [
      {
        value: '@ovh.fr',
        label: 'ovh.fr',
      },
    ];
  };

  this.init();
});
