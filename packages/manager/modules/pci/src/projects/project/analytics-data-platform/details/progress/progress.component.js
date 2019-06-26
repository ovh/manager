import './progress.scss';
import template from './progress.html';
import controller from './progress.controller';

export default {
  template,
  controller,
  bindings: {
    manageCluster: '<',
    projectId: '<',
    platformDetails: '<',
    serviceName: '<',
    accountDetails: '<',
    progress: '<',
    goToServicePage: '<',
  },
};
