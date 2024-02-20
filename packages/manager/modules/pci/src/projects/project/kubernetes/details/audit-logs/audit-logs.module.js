import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/manager-log-to-customer';

import auditLogsComponent from './audit-logs.component';
import routing from './audit-logs.routing';

const moduleName = 'ovhManagerPciProjectKubernetesDetailsAuditLogs';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
    'ovhManagerLogToCustomer',
  ])
  .config(routing)
  .component('pciProjectKubernetesDetailsAuditLogs', auditLogsComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
