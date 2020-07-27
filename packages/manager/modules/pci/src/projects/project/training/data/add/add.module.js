import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import component from './add.component';
import routing from './add.routing';

import ovhManagerPciStoragesContainers from '../../../storages/containers';

const moduleName = 'ovhManagerPciTrainingDataAdd';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    ovhManagerPciStoragesContainers,
  ])
  .config(routing)
  .component('pciProjectTrainingDataAddComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
