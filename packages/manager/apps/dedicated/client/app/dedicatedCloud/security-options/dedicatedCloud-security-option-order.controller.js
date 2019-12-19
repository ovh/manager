import assign from 'lodash/assign';
import filter from 'lodash/filter';
import find from 'lodash/find';
import pick from 'lodash/pick';

angular.module('App').controller('DedicatedCloudSecurityOptionOrderCtrl', ($stateParams, $rootScope, $scope, $q, $translate, Alerter, DedicatedCloud) => {
  $scope.optionName = $scope.currentActionData;

  $scope.loaders = {
    loading: true,
    checks: {
      nsx: true,
      vrops: true,
      trustedIp: true,
      restrictedAccess: true,
      user: true,
      userPhoneNumber: true,
      userMail: true,
      userTokenValidator: true,
    },
  };

  $scope.nextStepButtons = {
    1: false,
    2: false,
  };

  $scope.checks = {};

  function applyCheck(promise, checkName) {
    return promise
      .then((checkResult) => {
        $scope.checks[checkName] = checkResult;
        return checkResult;
      })
      .finally(() => {
        $scope.loaders.checks[checkName] = false;
      });
  }

  function checkOption(optionName) {
    return DedicatedCloud.getOptionState(optionName, $stateParams.productId).then((result) => {
      if (result.error) {
        Alerter.alertFromSWS($translate.instant('dedicatedCloud_options_check_error'), result.error);
      }

      return result === 'enabled';
    });
  }

  function checkRestrictedAccess() {
    return DedicatedCloud.getSecurityInformations($stateParams.productId).then((result) => {
      $scope.userAccessPolicy = result.userAccessPolicy;
      return result.userAccessPolicy === 'FILTERED';
    });
  }

  function checkTrustedIp() {
    return DedicatedCloud
      .getSecurityPolicies($stateParams.productId, null, null, true)
      .then((policies) => {
        $scope.listIp = policies.list.results;
        return policies.list.results.some((network) => network.status === 'ALLOWED');
      });
  }

  function loadUsers() {
    return DedicatedCloud
      .getUsers($stateParams.productId)
      .then((ids) => $q.all(ids.map((id) => DedicatedCloud.getUserDetail(
        $stateParams.productId,
        id,
      ))));
  }

  function checkUser() {
    return loadUsers()
      .then((users) => {
        $scope.users = filter(users, { isTokenValidator: true });
        return find(users, { name: 'admin' });
      })
      .then((adminUser) => {
        if (!adminUser) {
          return false;
        }
        $scope.checks.userPhoneNumber = !!adminUser.phoneNumber;
        $scope.checks.userMail = !!adminUser.email;
        $scope.checks.userTokenValidator = !!adminUser.isTokenValidator;
        return !!adminUser.phoneNumber && !!adminUser.email && !!adminUser.isTokenValidator;
      })
      .then((result) => {
        $scope.checks.user = result;
        return result;
      })
      .finally(() => {
        $scope.loaders.checks.user = false;
        $scope.loaders.checks.userPhoneNumber = false;
        $scope.loaders.checks.userMail = false;
        $scope.loaders.checks.userTokenValidator = false;
      });
  }

  function canEnableOption() {
    return DedicatedCloud.isOptionToggable($stateParams.productId, $scope.optionName, 'disabled', false);
  }

  $scope.checkCompliance = function checkCompliance() {
    function checkStep(step) {
      switch (step) {
        case 1:
          return $q.all([applyCheck(checkOption('nsx'), 'nsx'), applyCheck(checkOption('vrops'), 'vrops')]);
        case 2:
          return $q.all([applyCheck(checkRestrictedAccess(), 'restrictedAccess'), applyCheck(checkTrustedIp(), 'trustedIp')]);
        case 3:
          $scope.loaders.loading = true;
          return $q
            .all([checkUser(), canEnableOption()])
            .then((results) => {
              $scope.loaders.loading = false;
              if (results[1].oldCommercialVersion) {
                $scope.commercialRanges = results[1]; // eslint-disable-line
              }
            });
        default:
          return $q.reject();
      }
    }

    return checkStep($scope.currentStep);
  };

  $scope.optionCanBeEnabled = function optionCanBeEnabled() {
    return $scope.commercialRanges && !$scope.commercialRanges.error;
  };

  $scope.getCheckItemClass = function getCheckItemClass(item) {
    if ($scope.loaders.checks[item]) {
      return 'checklist__item_loading';
    }

    return $scope.checks[item] ? 'checklist__item_success' : 'checklist__item_failure';
  };

  $scope.getItemStatusText = function getItemStatusText(item) {
    if ($scope.checks[item]) {
      return 'dedicatedCloud_options_security_enabled';
    }
    return 'dedicatedCloud_options_security_disabled';
  };

  $scope.loadPrices = function loadPrices() {
    $scope.loaders.loading = true;
    return DedicatedCloud.getSelected($stateParams.productId)
      .then((pcc) => DedicatedCloud.fetchAllHostsPrices(
        $stateParams.productId,
        $scope.commercialRanges.oldCommercialVersion,
        $scope.commercialRanges.newCommercialVersion,
        pcc.location,
      ))
      .then((data) => {
        $scope.prices = data.current.map((host, index) => assign(pick(host, ['datacenter', 'name', 'billingType']), {
          current: host.price,
          next: data.next[index].price,
        }));
      })
      .catch((err) => {
        Alerter.alertFromSWS($translate.instant('dedicatedCloud_options_load_prices_error'), err);
        $scope.resetAction();
      })
      .finally(() => {
        $scope.loaders.loading = false;
      });
  };

  $scope.subscribeOption = function subscribeOption() {
    $scope.loaders.loading = true;

    DedicatedCloud.enableOption($stateParams.productId, $scope.optionName)
      .then((result) => {
        Alerter.success($translate.instant('dedicatedCloud_options_order_activate_success'));
        $rootScope.$broadcast('option-enable', {
          optionName: $scope.optionName,
          taskId: result.taskId,
        });
      })
      .catch((err) => {
        Alerter.alertFromSWS($translate.instant('dedicatedCloud_options_order_activate_error'), err);
      })
      .finally(() => {
        $scope.loaders.loading = false;
        $scope.resetAction();
      });
  };
});
