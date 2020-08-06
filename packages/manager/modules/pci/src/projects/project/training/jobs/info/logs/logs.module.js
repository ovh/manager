import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import component from './logs.component';
import routing from './logs.routing';
import 'angularjs-scroll-glue';

const moduleName = 'ovhManagerPciTrainingJobsInfoLogs';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'luegg.directives',
  ])
  .config(routing)
  .component('pciProjectTrainingJobsInfoLogsComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
