import template from './params.html';
import controller from './params.controller';

export default {
  template,
  controller,
  require: {
    telephonySchedulerCtrl: '^telephonyScheduler',
  },
};
