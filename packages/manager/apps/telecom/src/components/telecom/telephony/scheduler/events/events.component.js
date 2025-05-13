import template from './events.html';
import controller from './events.controller';

export default {
  template,
  controller,
  bindings: {
    event: '=ngModel',
    scheduler: '=telephonySchedulerEventsScheduler',
    timeCondition: '=telephonySchedulerEventsTimeCondition',
    onSave: '&telephonySchedulerEventsOnSave',
    onCancel: '&telephonySchedulerEventsOnCancel',
    onDelete: '&telephonySchedulerEventsOnDelete',
  },
};
