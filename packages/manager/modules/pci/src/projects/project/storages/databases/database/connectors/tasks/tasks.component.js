import controller from './tasks.controller';
import template from './tasks.html';
import './tasks.scss';

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
