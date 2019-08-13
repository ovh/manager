(function () {
  angular.module('managerApp').component('telephonyNumberSvi', {
    templateUrl: 'components/telecom/telephony/group/number/feature/svi/telephony-group-number-feature-svi.html',
    require: {
      numberCtrl: '^telephonyNumber',
    },
    controller: 'TelephonyNumberSviCtrl',
  });
}());
