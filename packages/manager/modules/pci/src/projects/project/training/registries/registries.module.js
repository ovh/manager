import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import component from './registries.component';
import routing from './registries.routing';
import service from '../registry.service';

import add from './add';
import deleteComponent from './delete';

const moduleName = 'ovhManagerPciTrainingRegistries';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    add,
    deleteComponent,
  ])
  .config(routing)
  .component('pciProjectTrainingRegistriesComponent', component)
  .service('PciProjectTrainingRegistryService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
