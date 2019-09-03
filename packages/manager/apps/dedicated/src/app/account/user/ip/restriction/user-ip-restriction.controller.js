angular.module('UserAccount').controller('UserAccount.controllers.ipRestrictions', [
  '$rootScope',
  '$scope',
  '$translate',
  'UserAccount.services.ipRestrictions',
  'Alerter',
  function ($rootScope, $scope, $translate, Service, Alerter) {
    $scope.ipRestrictionCurrentEdit = null;
    $scope.ipRestrictionCurrentEditBack = null;

    $scope.defaultConfDisabled = false;

    $scope.list = null;
    $scope.loaders = {
      defaultRule: false,
      list: false,
    };
    $scope.ipRestrictionsVisible = false;

    $scope.$on('ipRestriction.reload', () => {
      $scope.loadIpRestrictionsList();
      $scope.updateRestrictionButtonDisabled();
    });

    $scope.initIpRestrictions = function () {
      $scope
        .loadDefaultRule()
        .then(() => $scope.loadIpRestrictionsList())
        .then(() => {
          if ($scope.list.length > 0 || $scope.defaultRule.rule !== 'accept') {
            $scope.ipRestrictionsVisible = true;
          }
        });
    };

    $scope.ipRestrictionsShow = function () {
      $scope.ipRestrictionsVisible = true;
    };

    $scope.loadDefaultRule = function () {
      $scope.loaders.defaultRule = true;
      return Service.getDefaultRule()
        .then(
          (defaultRule) => {
            $scope.defaultRule = defaultRule;
            $scope.loaders.defaultRule = false;
            $scope.updateRestrictionButtonDisabled();
          },
          (err) => {
            Alerter.alertFromSWS($translate.instant('user_ipRestrictions_error'), err.data, 'ipRestrictionAlert');
          },
        )
        .finally(() => {
          $scope.loaders.defaultRule = false;
        });
    };

    $scope.updateDefaultRule = function () {
      $scope.loaders.defaultRule = true;
      Service.updateDefaultRule($scope.defaultRule)
        .then(
          () => {
            Alerter.success($translate.instant('user_ipRestrictions_defaultRule_success'), 'ipRestrictionAlert');
          },
          (err) => {
            Alerter.alertFromSWS($translate.instant('user_ipRestrictions_defaultRule_error'), err.data, 'ipRestrictionAlert');
          },
        )
        .finally(() => {
          $scope.loaders.defaultRule = false;
        });
    };

    $scope.updateRestrictionButtonDisabled = function () {
      $scope.defaultConfDisabled = !$scope.loaders.list && !$scope.loaders.defaultRule && (!$scope.list || $scope.list.length === 0) && (!$scope.defaultRule || $scope.defaultRule.rule === 'deny');
    };

    $scope.loadIpRestrictionsList = function () {
      $scope.loaders.list = true;
      return Service.getList()
        .then(
          (ipRestrictions) => {
            $scope.list = ipRestrictions;
            $scope.updateRestrictionButtonDisabled();
          },
          (data) => {
            Alerter.alertFromSWS($translate.instant('user_ipRestrictions_error'), data.data, 'ipRestrictionAlert');
          },
        )
        .finally(() => {
          $scope.loaders.list = false;
        });
    };

    $scope.setIpRestrictionCurrentEdit = function (restriction) {
      $scope.ipRestrictionCurrentEdit = angular.copy(restriction);
      $scope.ipRestrictionCurrentEditBack = restriction;
    };

    $scope.saveIpRestrictionCurrentEdit = function () {
      // TODO call SERVICE
      Service.updateRestriction($scope.ipRestrictionCurrentEdit)
        .then(
          () => {
            $rootScope.$broadcast('ipRestriction.reload');
          },
          (data) => {
            Alerter.alertFromSWS($translate.instant('user_ipRestrictions_update_error', { t0: $scope.ipRestrictionCurrentEdit.ip }), data.data, 'ipRestrictionAlert');
          },
        )
        .then(() => {
          $scope.ipRestrictionCurrentEdit = null;
          $scope.ipRestrictionCurrentEditBack = null;
        });
    };

    $scope.cancelIpRestrictionCurrentEdit = function () {
      $scope.ipRestrictionCurrentEdit = null;
      $scope.ipRestrictionCurrentEditBack = null;
    };
  },
]);
