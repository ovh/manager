import controller from './configuration.controller';
import template from './configuration.html';

export default {
  bindings: {
    cdn: '=',
    countriesIp: '<',
    countryIp: '=',
    domains: '<',
    firewall: '=',
    hosting: '<',
    ipLocation: '=',
    ownLog: '=',
    ownLogDomain: '=',
    path: '=',
    runtime: '=',
    runtimes: '<',
    ssl: '=',
    canModifyPathFolder: '<',
  },
  controller,
  template,
};
