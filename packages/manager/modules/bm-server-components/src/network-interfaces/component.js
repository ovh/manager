import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    server: '<',
    serverName: '<',
    interfaces: '<',
    specifications: '<',
    urls: '<',
    failoverIps: '<',
  },
  controller,
  template,
};
