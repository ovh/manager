import controller from './server.controller';
import template from './server.html';

export default {
  bindings: {
    currentActiveLink: '<',
    features: '<',
    ola: '<',
    server: '<',
    serviceInfos: '<',
    specifications: '<',
    user: '<',
    worldPart: '<',
    bringYourOwnImage: '<',
    resiliationCapability: '<',
  },
  controller,
  template,
};
