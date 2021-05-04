import template from './service.html';

const component = {
  bindings: {
    goToEditPlan: '<',
    goToAddAddon: '<',
    openPartnerConsole: '<',
    project: '<',
    projectId: '<',
    serviceInfo: '<',
    terminateProject: '<',
  },
  template,
};

export default component;
