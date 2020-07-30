import controller from './list.controller';
import template from './list.html';

export default {
  controller,
  template,
  bindings: {
    jobList: '<',
    job: '<',
    jobInfo: '<',
    jobKill: '<',
    submitJobLink: '<',
    jobInfoLink: '<',
    refreshState: '<',
    getClassForState: '<',
    jobCanBeKilled: '<',
  },
};
