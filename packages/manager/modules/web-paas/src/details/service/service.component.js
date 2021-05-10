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
    user: '<',
    userList: '<',
  },
  controller,
  template,
};

export default component;
