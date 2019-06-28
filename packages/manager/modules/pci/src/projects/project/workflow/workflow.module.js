import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'ovh-api-services';
import 'ovh-ui-angular';

import component from './workflow.component';
import routing from './workflow.routing';
import onboarding from './onboarding';
import add from './add';
import deleteWorkflow from './delete';
import executions from './executions';

const moduleName = 'ovhManagerPciProjectWorkflowModule';

angular.module(moduleName, [
  onboarding,
  add,
  deleteWorkflow,
  executions,
  'ngTranslateAsyncLoader',
  'pascalprecht.translate',
  'ngOvhCloudUniverseComponents',
  'oui',
  'ovh-api-services',
  'ui.router',
])
  .config(routing)
  .component('ovhManagerPciProjectWorkflow', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
