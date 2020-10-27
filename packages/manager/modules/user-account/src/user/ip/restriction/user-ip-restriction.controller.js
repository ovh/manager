export default class UserAccountIpRestrictionsController {
  /* @ngInject */
  constructor($rootScope, $scope, $translate, IpRestrictionsService, Alerter) {
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

    $scope.initIpRestrictions = function initIpRestrictions() {
      $scope
        .loadDefaultRule()
        .then(() => $scope.loadIpRestrictionsList())
        .then(() => {
          if ($scope.list.length > 0 || $scope.defaultRule.rule !== 'accept') {
            $scope.ipRestrictionsVisible = true;
          }
        });
    };

    $scope.ipRestrictionsShow = function ipRestrictionsShow() {
      $scope.ipRestrictionsVisible = true;
    };

    $scope.loadDefaultRule = function loadDefaultRule() {
      $scope.loaders.defaultRule = true;
      return IpRestrictionsService.getDefaultRule()
        .then(
          (defaultRule) => {
            $scope.defaultRule = defaultRule;
            $scope.loaders.defaultRule = false;
            $scope.updateRestrictionButtonDisabled();
          },
          (err) => {
            Alerter.alertFromSWS(
              $translate.instant('user_ipRestrictions_error'),
              err.data,
              'ipRestrictionAlert',
            );
          },
        )
        .finally(() => {
          $scope.loaders.defaultRule = false;
        });
    };

    $scope.updateDefaultRule = function updateDefaultRule() {
      $scope.loaders.defaultRule = true;
      IpRestrictionsService.updateDefaultRule($scope.defaultRule)
        .then(
          () => {
            Alerter.success(
              $translate.instant('user_ipRestrictions_defaultRule_success'),
              'ipRestrictionAlert',
            );
          },
          (err) => {
            Alerter.alertFromSWS(
              $translate.instant('user_ipRestrictions_defaultRule_error'),
              err.data,
              'ipRestrictionAlert',
            );
          },
        )
        .finally(() => {
          $scope.loaders.defaultRule = false;
        });
    };

    $scope.updateRestrictionButtonDisabled = function updateRestrictionButtonDisabled() {
      $scope.defaultConfDisabled =
        !$scope.loaders.list &&
        !$scope.loaders.defaultRule &&
        (!$scope.list || $scope.list.length === 0) &&
        (!$scope.defaultRule || $scope.defaultRule.rule === 'deny');
    };

    $scope.loadIpRestrictionsList = function loadIpRestrictionsList() {
      $scope.loaders.list = true;
      return IpRestrictionsService.getList()
        .then(
          (ipRestrictions) => {
            $scope.list = ipRestrictions;
            $scope.updateRestrictionButtonDisabled();
          },
          (data) => {
            Alerter.alertFromSWS(
              $translate.instant('user_ipRestrictions_error'),
              data.data,
              'ipRestrictionAlert',
            );
          },
        )
        .finally(() => {
          $scope.loaders.list = false;
        });
    };

    $scope.setIpRestrictionCurrentEdit = function setIpRestrictionCurrentEdit(
      restriction,
    ) {
      $scope.ipRestrictionCurrentEdit = angular.copy(restriction);
      $scope.ipRestrictionCurrentEditBack = restriction;
    };

    $scope.saveIpRestrictionCurrentEdit = function saveIpRestrictionCurrentEdit() {
      // TODO call SERVICE
      IpRestrictionsService.updateRestriction($scope.ipRestrictionCurrentEdit)
        .then(
          () => {
            $rootScope.$broadcast('ipRestriction.reload');
          },
          (data) => {
            Alerter.alertFromSWS(
              $translate.instant('user_ipRestrictions_update_error', {
                t0: $scope.ipRestrictionCurrentEdit.ip,
              }),
              data.data,
              'ipRestrictionAlert',
            );
          },
        )
        .then(() => {
          $scope.ipRestrictionCurrentEdit = null;
          $scope.ipRestrictionCurrentEditBack = null;
        });
    };

    $scope.cancelIpRestrictionCurrentEdit = function cancelIpRestrictionCurrentEdit() {
      $scope.ipRestrictionCurrentEdit = null;
      $scope.ipRestrictionCurrentEditBack = null;
    };
  }
}
