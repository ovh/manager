import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import component from './submit.component';
import routing from './submit.routing';
import data from '../../data.service';

const moduleName = 'ovhManagerPciTrainingJobsSubmit';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectTrainingJobsSubmitComponent', component)
  .service('PciProjectTrainingDataService', data)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
