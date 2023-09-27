import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import labs from '../../../components/project/labs';

import jobs from './jobs';

import onboarding from './onboarding';
import component from './training.component';
import routing from './training.routing';
import service from './training.service';
import jobService from './job.service';

const moduleName = 'ovhManagerPciTraining';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    labs,
    jobs,
    onboarding,
  ])
  .config(routing)
  .component('pciProjectTraining', component)
  .service('PciProjectTrainingService', service)
  .service('PciProjectTrainingJobService', jobService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
