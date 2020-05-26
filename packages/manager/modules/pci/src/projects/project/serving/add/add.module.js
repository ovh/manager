import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ng-at-internet';

import component from './add.component';
import routing from './add.routing';
import service from './add.service';

import ovhManagerPciStoragesContainers from '../../storages/containers';

const moduleName = 'ovhManagerPciServingAdd';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'ngOvhCloudUniverseComponents',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    'ngAtInternet',
    ovhManagerPciStoragesContainers,
  ])
  .config(routing)
  .component('ovhManagerPciServingAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('ovhManagerPciServingAdd', service);

export default moduleName;
