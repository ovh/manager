import controller from './training.controller';
import template from './training.html';

export default {
  controller,
  template,
  bindings: {
    installLink: '<',
    jobInfoLink: '<',
    jobsLink: '<',
    currentActiveLink: '<',
    dataLink: '<',
    allUsers: '<',
    regions: '<',
  },
};
