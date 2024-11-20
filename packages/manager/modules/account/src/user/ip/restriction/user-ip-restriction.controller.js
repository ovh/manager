export default [
  '$rootScope',
  '$scope',
  '$translate',
  'UserAccount.services.ipRestrictions',
  'Alerter',
  function UserAccountIpRestrictionsController(
    $rootScope,
    $scope,
    $translate,
    Service,
    Alerter,
  ) {
    $scope.ipRestrictionCurrentEdit = null;
    $scope.ipRestrictionCurrentEditBack = null;
    $scope.ipRestrictionDefaultRule = null;

    $scope.list = null;
    $scope.loaders = {
      defaultRule: false,
      list: false,
    };
    $scope.ipRestrictionsVisible = false;

    $scope.$on('ipRestriction.reload', () => {
      $scope.loadIpRestrictionsList();
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
      return Service.getDefaultRule()
        .then(
          (defaultRule) => {
            $scope.defaultRule = defaultRule;
            $scope.ipRestrictionDefaultRule = { ...defaultRule };
            $scope.loaders.defaultRule = false;
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
      Service.updateDefaultRule($scope.defaultRule)
        .then(
          () => {
            $scope.ipRestrictionDefaultRule = { ...$scope.defaultRule };
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

    $scope.loadIpRestrictionsList = function loadIpRestrictionsList() {
      $scope.loaders.list = true;
      return Service.getList()
        .then(
          (ipRestrictions) => {
            $scope.list = ipRestrictions;
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
      Service.updateRestriction($scope.ipRestrictionCurrentEdit)
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

    /**
     * Prevent set `ipRestrictionDefaultRule.rule` to `deny` with an empty
     * list of IP address configured, otherwise it will automatically logout
     * the user.
     * @return {boolean}
     */
    $scope.preventSubmitIfDefaultRuleIsDeny = function preventSubmitIfDefaultRuleIsDeny() {
      return (
        $scope.list.length === 0 &&
        $scope.ipRestrictionDefaultRule.rule === 'accept' &&
        $scope.defaultRule.rule === 'deny'
      );
    };

    /**
     * Prevent removing the last IP address if `ipRestrictionDefaultRule.rule`
     * is configured to `deny`, otherwise it will automatically logout the
     * user.
     * @return {boolean}
     */
    $scope.shouldDisplayWarningMessage = function shouldDisplayWarningMessage() {
      return (
        $scope.list.length === 1 &&
        $scope.ipRestrictionDefaultRule.rule === 'deny'
      );
    };
  },
];
