import template from './filters.html';
import controller from './filters.controller';

export default {
  template,
  controller,
  require: {
    telephonySchedulerCtrl: '^telephonyScheduler',
  },
  bindings: {
    filters: '=ngModel',
    onChange: '&telephonySchedulerFiltersOnChange',
  },
};
