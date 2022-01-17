import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/manager-filters';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import info from './info';
import submit from './submit';
import resubmit from './resubmit';
import kill from './kill';
import component from './jobs.component';
import routing from './jobs.routing';
import service from '../job.service';

const moduleName = 'ovhManagerPciTrainingJobs';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'ovhManagerFilters',
    'pascalprecht.translate',
    'ui.router',
    info,
    submit,
    resubmit,
    kill,
  ])
  .config(routing)
  .component('pciProjectTrainingJobsComponent', component)
  .service('PciProjectTrainingJobsService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
