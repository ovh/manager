(function () {
  angular.module('managerApp').component('telephonySchedulerEvents', {
    templateUrl: 'components/telecom/telephony/scheduler/events/telephony-scheduler-events.html',
    controller: 'TelephonySchedulerEventsCtrl',
    bindings: {
      event: '=ngModel',
      scheduler: '=telephonySchedulerEventsScheduler',
      timeCondition: '=telephonySchedulerEventsTimeCondition',
      onSave: '&telephonySchedulerEventsOnSave',
      onCancel: '&telephonySchedulerEventsOnCancel',
      onDelete: '&telephonySchedulerEventsOnDelete',
    },
  });
}());
