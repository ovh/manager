import controller from './submit.controller';
import template from './submit.html';

export default {
  controller,
  template,
  bindings: {
    submitJob: '<',
    allUsers: '<',
    allRegions: '<',
  },
};
