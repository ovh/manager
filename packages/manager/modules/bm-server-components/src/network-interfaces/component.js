import template from './template.html';

export default {
  bindings: {
    server: '<',
    serverName: '<',
    interfaces: '<',
    specifications: '<',
    urls: '<',
    failoverIps: '<',
  },
  template,
};
