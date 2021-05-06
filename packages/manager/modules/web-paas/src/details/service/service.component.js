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
    userList: '<',
  },
  template,
};

export default component;
