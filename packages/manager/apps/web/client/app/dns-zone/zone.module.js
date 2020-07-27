import dashboard from './dashboard';
import dynhost from './dynhost';
import newDnsZone from './new';
import redirection from './redirection';
import tasks from './tasks';

import routing from './dns-zone.routing';

const moduleName = 'ovhManagerWebDomainDnsZone';

angular
  .module(moduleName, [dashboard, dynhost, newDnsZone, redirection, tasks])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
