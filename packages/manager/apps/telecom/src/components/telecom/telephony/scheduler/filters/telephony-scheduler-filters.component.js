(function () {
  angular.module('managerApp').component('telephonySchedulerFilters', {
    require: {
      telephonySchedulerCtrl: '^telephonyScheduler',
    },
    templateUrl: 'components/telecom/telephony/scheduler/filters/telephony-scheduler-filters.html',
    controller: 'TelephonySchedulerFiltersCtrl',
    bindings: {
      filters: '=ngModel',
      onChange: '&telephonySchedulerFiltersOnChange',
    },
  });
}());
