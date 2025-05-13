import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import component from './info.component';
import routing from './info.routing';

import deleteJobModale from './delete';
import logs from './logs';

const moduleName = 'ovhManagerPciTrainingJobsInfo';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    logs,
    deleteJobModale,
  ])
  .config(routing)
  .component('pciProjectTrainingJobsInfoComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
