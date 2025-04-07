import debounce from 'lodash/debounce';

export default [
  '$rootScope',
  '$scope',
  '$translate',
  'Alerter',
  'atInternet',
  'UserAccount.services.ipRestrictions',
  'Validator',
  function UserAccountIpRestrictionsAddController(
    $rootScope,
    $scope,
    $translate,
    Alerter,
    atInternet,
    Service,
    Validator,
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
            (Validator.isValidIpv4(target) ||
              Validator.isValidIpv6(target) ||
              Validator.isValidIpv4Block(target) ||
              Validator.isValidIpv6Block(target));
        });
      }, 100),
    );

    $scope.addRestriction = function addRestriction() {
      $scope.resetAction();
      Service.addRestriction($scope.restriction)
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
  },
];
