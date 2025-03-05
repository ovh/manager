import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/manager-log-to-customer';

import audit from './audit';
import routing from './logs.routing';
import component, { name } from './logs.component';
import service from './logs.service';

const moduleName = 'ovhManagerIAMLogs';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
    'ovhManagerLogToCustomer',
    audit,
  ])
  .component(name, component)
  .config(routing)
  .service('logsService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
