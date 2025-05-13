import controller from './informations.controller';
import template from './informations.html';
import './informations.scss';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    trackDashboard: '<',
    user: '<',
  },
  controller,
  template,
};

export default component;
