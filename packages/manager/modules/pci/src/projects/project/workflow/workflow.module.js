import '@uirouter/angularjs';
import 'angular-translate';
import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import add from './add';
import component from './workflow.component';
import routing from './workflow.routing';

const moduleName = 'ovhManagerPciProjectsProjectWorkflowModule';

angular
  .module(moduleName, [
    add,
    'ngTranslateAsyncLoader',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciProjectsProjectWorkflow', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
