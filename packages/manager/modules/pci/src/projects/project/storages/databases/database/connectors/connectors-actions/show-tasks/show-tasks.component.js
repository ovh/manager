import controller from './show-tasks.controller';
import template from './show-tasks.html';
import './show-tasks.scss';

export default {
  bindings: {
    database: '<',
    projectId: '<',
    trackDashboard: '<',
    goBack: '<',
    goToEdit: '<',
    connector: '<',
  },
  controller,
  template,
};
