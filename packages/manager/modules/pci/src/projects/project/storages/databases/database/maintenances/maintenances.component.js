import controller from './maintenances.controller';
import template from './maintenances.html';

const component = {
  bindings: {
    database: '<',
    goBacktoGeneralInformation: '<',
    projectId: '<',
    trackDashboard: '<',
    maintenances: '<',
  },
  template,
  controller,
};

export default component;
