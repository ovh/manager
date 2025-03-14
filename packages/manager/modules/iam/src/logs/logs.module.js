import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/manager-log-to-customer';

import audit from './audit';
import accessPolicy from './access-policy';
import dataStream from '../components/logs/data-streams';
import liveTail from '../components/logs/live-tail';
import routing from './logs.routing';
import component, { name } from './logs.component';

const moduleName = 'ovhManagerIAMLogs';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
    'ovhManagerLogToCustomer',
    dataStream,
    liveTail,
    audit,
    accessPolicy,
  ])
  .component(name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
