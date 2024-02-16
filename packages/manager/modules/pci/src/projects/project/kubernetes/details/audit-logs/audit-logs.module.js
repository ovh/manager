import angular from 'angular';
import '@ovh-ux/ng-log-to-customer';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import 'angular-translate';

import auditLogsComponent from './audit-logs.component';
import routing from './audit-logs.routing';

const moduleName = 'ovhManagerPciProjectKubernetesDetailsAuditLogs';

angular
  .module(moduleName, [
    'ngLogToCustomer',
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectKubernetesDetailsAuditLogs', auditLogsComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
