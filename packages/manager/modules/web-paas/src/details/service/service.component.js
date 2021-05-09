import controller from './service.controller';
import template from './service.html';

const component = {
  bindings: {
    goToChangeOffer: '<',
    goToAddAddon: '<',
    openPartnerConsole: '<',
    project: '<',
    projectId: '<',
    serviceInfo: '<',
    terminateProject: '<',
    userList: '<',
  },
  controller,
  template,
};

export default component;
