import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'ovh-api-services';
import 'ovh-ui-angular';

import component from './executions.component';
import routing from './executions.routing';

const moduleName = 'ovhManagerPciProjectWorkflowExecutionsModule';

angular.module(moduleName, [
  'ngTranslateAsyncLoader',
  'pascalprecht.translate',
  'ngOvhCloudUniverseComponents',
  'oui',
  'ovh-api-services',
  'ui.router',
])
  .config(routing)
  .component('ovhManagerPciProjectWorkflowExecutions', component);

export default moduleName;
