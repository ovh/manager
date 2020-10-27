export default class UserAccountIpRestrictionsDeleteController {
  /* @ngInject */
  constructor($rootScope, $scope, $translate, IpRestrictionsService, Alerter) {
    $scope.data = $scope.currentActionData;

    $scope.deleteRestriction = function deleteRestriction() {
      $scope.resetAction();
      IpRestrictionsService.deleteRestriction($scope.data).then(
        () => {
          $rootScope.$broadcast('ipRestriction.reload');
        },
        (data) => {
          Alerter.alertFromSWS(
            $translate.instant('user_ipRestrictions_delete_error', {
              t0: $scope.data.ip,
            }),
            data.data,
            'ipRestrictionAlert',
          );
        },
      );
    };
  }
}
