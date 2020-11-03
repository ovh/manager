import debounce from 'lodash/debounce';

export default class UserAccountIpRestrictionsAddController {
  /* @ngInject */
  constructor(
    $rootScope,
    $scope,
    $translate,
    Alerter,
    atInternet,
    IpRestrictionsService,
    ducUserValidator,
  ) {
    $scope.isValid = false;
    $scope.restriction = {
      ip: null,
      warning: false,
      rule: 'ACCEPT',
    };

    $scope.$watch(
      'restriction.ip',
      debounce((target) => {
        $scope.$apply(() => {
          $scope.isValid =
            target != null &&
            (ducUserValidator.isValidIpv4(target) ||
              ducUserValidator.isValidIpv6(target) ||
              ducUserValidator.isValidIpv4Block(target) ||
              ducUserValidator.isValidIpv6Block(target));
        });
      }, 100),
    );

    $scope.addRestriction = function addRestriction() {
      $scope.resetAction();
      IpRestrictionsService.addRestriction($scope.restriction)
        .then(() => {
          $rootScope.$broadcast('ipRestriction.reload');
        })
        .catch((data) => {
          Alerter.alertFromSWS(
            $translate.instant('user_ipRestrictions_add_error', {
              t0: $scope.restriction.ip,
            }),
            data.data,
            'ipRestrictionAlert',
          );
        })
        .finally(() => {
          atInternet.trackClick({
            name: 'validation_add_IP_restriction',
            type: 'action',
            chapter1: 'account',
            chapter2: 'security',
            chapter3: 'IP',
          });
        });
    };
  }
}
