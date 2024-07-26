import dashboard from '../dashboard';
import dynhost from '../dynhost';
import newDnsZone from '../new';
import redirection from '../../domain/redirection/redirection.module';
import tasks from '../tasks';
import history from '../history';

import routing from './dns-zone.routing';

const moduleName = 'ovhManagerWebDomainDnsZone';

angular
  .module(moduleName, [
    dashboard,
    dynhost,
    newDnsZone,
    redirection,
    tasks,
    history,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
