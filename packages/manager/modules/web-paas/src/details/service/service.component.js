import template from './service.html';

const component = {
  bindings: {
    goToEditPlan: '<',
    terminateProject: '<',
    project: '<',
    projectId: '<',
    openPartnerConsole: '<',
    serviceInfo: '<',
    goToAddAddon: '<',
  },
  template,
};

export default component;
