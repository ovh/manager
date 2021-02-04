import template from './service.html';

const component = {
  bindings: {
    createProject: '<',
    terminateProject: '<',
    project: '<',
    projectId: '<',
    openPartnerConsole: '<',
  },
  template,
};

export default component;
