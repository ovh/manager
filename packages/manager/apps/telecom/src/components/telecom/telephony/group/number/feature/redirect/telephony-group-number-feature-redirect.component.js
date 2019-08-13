(function () {
  angular.module('managerApp').component('telephonyNumberRedirect', {
    templateUrl: 'components/telecom/telephony/group/number/feature/redirect/telephony-group-number-feature-redirect.html',
    require: {
      numberCtrl: '^telephonyNumber',
    },
    controller: 'TelephonyNumberRedirectCtrl',
  });
}());
