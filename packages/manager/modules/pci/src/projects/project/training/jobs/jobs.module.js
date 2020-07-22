import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';
import 'ovh-api-services';

import info from './info';
import list from './list';
import submit from './submit';
import component from './jobs.component';
import routing from './jobs.routing';
import service from './jobs.service';

const moduleName = 'ovhManagerPciTrainingJobs';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    info,
    list,
    submit,
  ])
  .config(routing)
  .component('pciProjectTrainingJobsComponent', component)
  .service('PciProjectTrainingJobsService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
