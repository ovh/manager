(function () {
  angular.module('managerApp').component('telephonySchedulerParams', {
    require: {
      telephonySchedulerCtrl: '^telephonyScheduler',
    },
    templateUrl: 'components/telecom/telephony/scheduler/params/telephony-scheduler-params.html',
    controller: 'TelephonySchedulerParamsCtrl',
  });
}());
