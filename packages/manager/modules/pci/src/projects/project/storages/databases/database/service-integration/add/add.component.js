import controller from './add.controller';
import template from './add.html';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    trackDashboard: '<',
    addableServicesList: '<',
  },
  template,
  controller,
};

export default component;
