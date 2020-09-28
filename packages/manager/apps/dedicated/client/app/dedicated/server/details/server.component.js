import controller from './server.controller';
import template from './server.html';

export default {
  bindings: {
    ola: '<',
    server: '<',
    serviceInfos: '<',
    specifications: '<',
    user: '<',
    worldPart: '<',
    bringYourOwnImage: '<',
  },
  controller,
  template,
};
