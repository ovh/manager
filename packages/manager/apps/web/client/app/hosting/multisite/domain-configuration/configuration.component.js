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
    ipv6: '=',
    ownLog: '=',
    ownLogDomain: '=',
    path: '=',
    runtime: '=',
    runtimes: '<',
    ssl: '=',
    canModifyDomainWithGit: '<',
  },
  controller,
  template,
};
