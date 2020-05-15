import dashboard from './dashboard';
import dynhost from './dynhost';
import newDnsZone from './new';
import redirection from './redirection';
import tasks from './tasks';

import routing from './dns-zone.routing';
import service from './dns-zone.service';

const moduleName = 'ovhManagerWebDomainDnsZone';

angular
  .module(moduleName, [dashboard, dynhost, newDnsZone, redirection, tasks])
  .config(routing)
  .service('DNSZoneService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
