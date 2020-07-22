import controller from './training.controller';
import template from './training.html';

export default {
  controller,
  template,
  bindings: {
    installLink: '<',
    jobsLink: '<',
    currentActiveLink: '<',
    dataLink: '<',
    allUsers: '<',
    allRegions: '<',
  },
};
