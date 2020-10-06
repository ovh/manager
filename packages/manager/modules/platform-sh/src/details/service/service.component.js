import controller from './service.controller';
import template from './service.html';

const component = {
  bindings: {
    changeProjectName: '<',
    createProject: '<',
    terminateProject: '<',
    project: '<',
    projectId: '<',
    openPartnerConsole: '<',
  },
  template,
  controller,
};

export default component;
