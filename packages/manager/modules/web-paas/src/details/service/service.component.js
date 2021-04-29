import template from './service.html';

const component = {
  bindings: {
    goToEditPlan: '<',
    terminateProject: '<',
    project: '<',
    projectId: '<',
    openPartnerConsole: '<',
    serviceInfo: '<',
    goToAddStorage: '<',
  },
  template,
};

export default component;
